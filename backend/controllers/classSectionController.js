import { sutando } from '../config/database.js';

const knex = (table) => sutando.connection().table(table);

// Mapping from letter A-Z to ID and back
const LETTER_TO_ID = {};
const ID_TO_LETTER = {};
for (let i = 0; i < 26; i++) {
  const letter = String.fromCharCode(65 + i);
  LETTER_TO_ID[letter] = i + 1;
  ID_TO_LETTER[i + 1] = letter;
}

export const classSectionController = {
  async list(req, res, next) {
    try {
      const { branch_id, academic_year_id, search, status } = req.query;
      const bId = Number(branch_id) || 1;
      const ayId = Number(academic_year_id) || 5;

      // 1. Fetch enablement settings from academic_year_classes for this branch and academic year
      const yearClasses = await knex('academic_year_classes')
        .where({ branch_id: bId, academic_year_id: ayId });
      const enableMap = new Map();
      for (const yc of yearClasses) {
        enableMap.set(Number(yc.class_id), Boolean(yc.is_enabled !== 0));
      }

      // Base query for classes
      let classQuery = knex('classes');
      if (search && search.trim()) {
        classQuery = classQuery.where('class_name', 'like', `%${search.trim()}%`);
      }
      const rawClasses = await classQuery.select('*').orderBy('numeric_value', 'asc');

      // Include ALL classes regardless of is_enabled — disabled classes show as grayed rows in the grid
      let activeClasses = rawClasses;

      // 2. Fetch existing sections assigned for this branch and academic year
      const existingSections = await knex('sections')
        .where('branch_id', bId)
        .where('academic_year_id', ayId)
        .select('*');

      // 3. Fetch student enrollment counts for this branch and academic year grouped by class_id and section_name
      const [studentCounts] = await sutando.connection().raw(`
        SELECT s.class_id, sec.section_name, sec.id as section_id, COUNT(*) as count 
        FROM students s 
        JOIN sections sec ON s.section_id = sec.id 
        WHERE sec.academic_year_id = ? AND s.branch_id = ?
        GROUP BY s.class_id, sec.section_name, sec.id
      `, [ayId, bId]);

      // Map: class_id -> { [sectionId]: count, [sectionName]: count }
      const classSectionStudentMap = new Map();
      const classTotalStudentMap = new Map();
      if (Array.isArray(studentCounts)) {
        for (const row of studentCounts) {
          const cid = Number(row.class_id);
          const sName = (row.section_name || '').trim().toUpperCase();
          const count = Number(row.count || 0);
          const sId = LETTER_TO_ID[sName] || Number(row.section_id);

          if (!classSectionStudentMap.has(cid)) {
            classSectionStudentMap.set(cid, {});
          }
          const secObj = classSectionStudentMap.get(cid);
          secObj[sId] = (secObj[sId] || 0) + count;
          secObj[sName] = (secObj[sName] || 0) + count;

          classTotalStudentMap.set(cid, (classTotalStudentMap.get(cid) || 0) + count);
        }
      }

      // 4. "Map and associate active section only"
      // Find all distinct active section names in this branch and academic year (where is_enabled != 0)
      const activeSectionNameSet = new Set(
        existingSections
          .filter((s) => s.is_enabled !== 0)
          .map((s) => s.section_name.trim().toUpperCase())
      );

      // Default baseline active section letters ['A', 'B', 'C', 'D'] if none yet
      let activeNames = Array.from(activeSectionNameSet);
      if (activeNames.length === 0) {
        activeNames = ['A', 'B', 'C', 'D'];
      } else {
        // Always include standard active letters if they exist or aren't disabled
        ['A', 'B', 'C', 'D'].forEach((std) => {
          // Check if std is explicitly disabled
          const isDisabled = existingSections.some(
            (s) => s.section_name.trim().toUpperCase() === std && s.is_enabled === 0
          );
          if (!isDisabled && !activeNames.includes(std)) {
            activeNames.push(std);
          }
        });
        activeNames.sort();
      }

      const activeSectionsList = activeNames.map((letter) => ({
        id: LETTER_TO_ID[letter] || 1,
        name: letter,
        section_name: letter,
        code: `SEC-${letter}`,
        status: 'Active',
        is_enabled: true,
      }));

      // 5. Build class objects with student counts and locked indicators
      const classes = activeClasses.map((c) => {
        const cId = Number(c.id);
        const studentCount = classTotalStudentMap.get(cId) || 0;
        const isLocked = studentCount > 0;
        const secStudents = classSectionStudentMap.get(cId) || {};

        // Section IDs that have enrolled students > 0
        const lockedSectionIds = [];
        for (const [secKey, sCount] of Object.entries(secStudents)) {
          if (Number(sCount) > 0) {
            const numKey = Number(secKey);
            if (!isNaN(numKey) && !lockedSectionIds.includes(numKey)) {
              lockedSectionIds.push(numKey);
            }
          }
        }
        const isClassEnabled = enableMap.has(cId) ? enableMap.get(cId) : true;
        return {
          id: c.id,
          name: c.class_name,
          class_name: c.class_name,
          code: `CLS-${c.id}`,
          class_code: `CLS-${c.id}`,
          short_name: c.class_name,
          display_order: c.numeric_value || c.id,
          status: isClassEnabled ? 'Active' : 'Inactive',
          class_status: isClassEnabled ? 'Active' : 'Inactive',
          is_enabled: isClassEnabled,
          student_count: studentCount,
          student_status: isLocked ? 'Students Assigned' : 'No Students',
          is_locked: isLocked,
          section_students: secStudents,
          locked_section_ids: lockedSectionIds,
        };
      });

      // Filter classes by status if requested (Active / Inactive)
      let filteredClasses = classes;
      if (status && status !== 'all') {
        filteredClasses = classes.filter((c) => c.status?.toLowerCase() === status.toLowerCase());
      }

      const summary = filteredClasses.map((c) => {
        // Only active sections (is_enabled != 0) that are in activeNames
        const assigned = existingSections.filter(
          (s) =>
            s.class_id === c.id &&
            s.is_enabled !== 0 &&
            activeNames.includes(s.section_name.trim().toUpperCase())
        );

        const mappedSectionIds = assigned
          .map((s) => LETTER_TO_ID[s.section_name.trim().toUpperCase()] || null)
          .filter(Boolean);

        const mappedSectionNames = assigned.map((s) => s.section_name.trim().toUpperCase());

        return {
          class_id: c.id,
          class_name: c.name,
          class_code: c.code,
          short_name: c.short_name,
          display_order: c.display_order,
          class_status: c.class_status,
          is_enabled: c.is_enabled,
          student_count: c.student_count,
          student_status: c.student_status,
          is_locked: c.is_locked,
          total_sections: mappedSectionNames.length,
          sections_list: mappedSectionNames.sort().join(', ') || 'No sections assigned',
          section_ids: mappedSectionIds,
          section_students: c.section_students,
          locked_section_ids: c.locked_section_ids,
          status: c.status,
        };
      });

      res.json({
        success: true,
        data: {
          classes: filteredClasses,
          sections: activeSectionsList,
          summary,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async saveMatrix(req, res, next) {
    try {
      const { branch_id, academic_year_id, updates } = req.body;
      const bId = Number(branch_id) || 1;
      const ayId = Number(academic_year_id) || 5;

      if (Array.isArray(updates)) {
        for (const u of updates) {
          const classId = Number(u.class_id);
          const desiredIds = Array.isArray(u.section_ids) ? u.section_ids.map(Number) : [];
          const desiredLetters = desiredIds.map((id) => ID_TO_LETTER[id]).filter(Boolean);

          // Get existing sections for this class
          const currentSections = await knex('sections')
            .where({ branch_id: bId, academic_year_id: ayId, class_id: classId })
            .select('*');

          const currentLetters = currentSections.map((s) => s.section_name.toUpperCase());

          // Remove unselected sections
          const toRemove = currentSections.filter(
            (s) => !desiredLetters.includes(s.section_name.toUpperCase())
          );

          if (toRemove.length > 0) {
            const removeIds = toRemove.map((s) => s.id);
            // Guard: If student is there, disable removal!
            const [enrolled] = await sutando.connection().raw(`
              SELECT s.id, sec.section_name, c.class_name, COUNT(*) as count
              FROM students s
              JOIN sections sec ON s.section_id = sec.id
              LEFT JOIN classes c ON sec.class_id = c.id
              WHERE sec.id IN (?)
              GROUP BY s.id, sec.section_name, c.class_name
            `, [removeIds]);

            if (enrolled && enrolled.length > 0) {
              const secName = enrolled[0].section_name;
              const clsName = enrolled[0].class_name || `Class #${classId}`;
              return res.status(400).json({
                success: false,
                message: `Cannot unmap Section ${secName} from ${clsName}: ${enrolled.length} student(s) are currently enrolled in this section. Section is locked.`
              });
            }

            await knex('sections')
              .whereIn('id', removeIds)
              .del();
          }

          // Insert newly selected sections
          const toAdd = desiredLetters.filter((l) => !currentLetters.includes(l));
          for (const letter of toAdd) {
            await knex('sections').insert({
              branch_id: bId,
              academic_year_id: ayId,
              class_id: classId,
              section_name: letter,
              capacity: 40,
              is_enabled: 1,
              created_at: new Date(),
              updated_at: new Date(),
            });
          }
        }
      }

      res.json({ success: true, message: 'Class section matrix saved successfully' });
    } catch (err) {
      next(err);
    }
  },

  async saveClassMappings(req, res, next) {
    try {
      const classId = Number(req.params.classId);
      const { branch_id, academic_year_id, section_ids } = req.body;
      const bId = Number(branch_id) || 1;
      const ayId = Number(academic_year_id) || 5;
      const desiredIds = Array.isArray(section_ids) ? section_ids.map(Number) : [];
      const desiredLetters = desiredIds.map((id) => ID_TO_LETTER[id]).filter(Boolean);

      const currentSections = await knex('sections')
        .where({ branch_id: bId, academic_year_id: ayId, class_id: classId })
        .select('*');

      const currentLetters = currentSections.map((s) => s.section_name.toUpperCase());

      const toRemove = currentSections.filter(
        (s) => !desiredLetters.includes(s.section_name.toUpperCase())
      );

      if (toRemove.length > 0) {
        const removeIds = toRemove.map((s) => s.id);
        const [enrolled] = await sutando.connection().raw(`
          SELECT s.id, sec.section_name, c.class_name, COUNT(*) as count
          FROM students s
          JOIN sections sec ON s.section_id = sec.id
          LEFT JOIN classes c ON sec.class_id = c.id
          WHERE sec.id IN (?)
          GROUP BY s.id, sec.section_name, c.class_name
        `, [removeIds]);

        if (enrolled && enrolled.length > 0) {
          const secName = enrolled[0].section_name;
          const clsName = enrolled[0].class_name || `Class #${classId}`;
          return res.status(400).json({
            success: false,
            message: `Cannot unmap Section ${secName} from ${clsName}: ${enrolled.length} student(s) are currently enrolled in this section. Section is locked.`
          });
        }

        await knex('sections')
          .whereIn('id', removeIds)
          .del();
      }

      const toAdd = desiredLetters.filter((l) => !currentLetters.includes(l));
      for (const letter of toAdd) {
        await knex('sections').insert({
          branch_id: bId,
          academic_year_id: ayId,
          class_id: classId,
          section_name: letter,
          capacity: 40,
          is_enabled: 1,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      res.json({ success: true, message: 'Class sections updated successfully' });
    } catch (err) {
      next(err);
    }
  },
};

export default classSectionController;
