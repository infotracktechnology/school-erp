import { sutando } from '../config/database.js';

export const examTermController = {
  // ── 1. List Term Structures for Branch + Academic Year ──
  async list(req, res, next) {
    try {
      const conn = sutando.connection();
      const { branch_id = 1, academic_year_id = 2 } = req.query;

      const [structures] = await conn.raw(`
        SELECT * FROM exam_term_structures 
        WHERE branch_id = ? AND academic_year_id = ? 
        ORDER BY id DESC
      `, [branch_id, academic_year_id]);

      // Attach classes and terms for each structure
      for (const st of structures) {
        const [classes] = await conn.raw(
          'SELECT class_id, class_name FROM exam_term_structure_classes WHERE structure_id = ?',
          [st.id]
        );
        st.classes = classes;

        const [terms] = await conn.raw(
          'SELECT * FROM exam_terms WHERE structure_id = ? ORDER BY display_order ASC, id ASC',
          [st.id]
        );
        st.terms = terms;
      }

      res.json({ success: true, data: structures });
    } catch (err) {
      next(err);
    }
  },

  // ── 2. Create New Term Structure ──
  async create(req, res, next) {
    try {
      const conn = sutando.connection();
      const { 
        branch_id = 1, 
        academic_year_id = 2, 
        structure_name, 
        board_type = 'CBSE',
        classes = [], // array of { class_id, class_name }
        terms = [] // array of { term_name, display_name, from_date, to_date, weightage_percent, is_selected }
      } = req.body;

      if (!structure_name?.trim()) {
        return res.status(400).json({ success: false, message: 'Structure name is required.' });
      }

      // 1. Insert Master Structure
      const [insertResult] = await conn.raw(`
        INSERT INTO exam_term_structures (branch_id, academic_year_id, structure_name, board_type, is_active)
        VALUES (?, ?, ?, ?, 1)
      `, [branch_id, academic_year_id, structure_name.trim(), board_type]);

      const structureId = insertResult.insertId;

      // 2. Insert Classes
      if (Array.isArray(classes) && classes.length > 0) {
        for (const cls of classes) {
          await conn.raw(`
            INSERT IGNORE INTO exam_term_structure_classes (structure_id, class_id, class_name)
            VALUES (?, ?, ?)
          `, [structureId, cls.class_id, cls.class_name || null]);
        }
      }

      // 3. Insert Terms
      if (Array.isArray(terms) && terms.length > 0) {
        let order = 1;
        for (const t of terms) {
          await conn.raw(`
            INSERT INTO exam_terms (structure_id, term_name, display_name, from_date, to_date, weightage_percent, is_selected, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            structureId,
            t.term_name || `Term ${order}`,
            t.display_name || t.term_name || `Term ${order}`,
            t.from_date || null,
            t.to_date || null,
            Number(t.weightage_percent || 100),
            t.is_selected !== false ? 1 : 0,
            order++
          ]);
        }
      }

      res.json({
        success: true,
        message: 'Term structure created successfully!',
        id: structureId
      });
    } catch (err) {
      next(err);
    }
  },

  // ── 3. Update Term Structure ──
  async update(req, res, next) {
    try {
      const conn = sutando.connection();
      const { id } = req.params;
      const { structure_name, board_type, classes = [], terms = [] } = req.body;

      await conn.raw(`
        UPDATE exam_term_structures 
        SET structure_name = ?, board_type = ?, updated_at = NOW()
        WHERE id = ?
      `, [structure_name, board_type, id]);

      // Sync classes
      await conn.raw('DELETE FROM exam_term_structure_classes WHERE structure_id = ?', [id]);
      for (const cls of classes) {
        await conn.raw(`
          INSERT IGNORE INTO exam_term_structure_classes (structure_id, class_id, class_name)
          VALUES (?, ?, ?)
        `, [id, cls.class_id, cls.class_name]);
      }

      // Sync terms
      await conn.raw('DELETE FROM exam_terms WHERE structure_id = ?', [id]);
      let order = 1;
      for (const t of terms) {
        await conn.raw(`
          INSERT INTO exam_terms (structure_id, term_name, display_name, from_date, to_date, weightage_percent, is_selected, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id,
          t.term_name,
          t.display_name,
          t.from_date || null,
          t.to_date || null,
          Number(t.weightage_percent || 100),
          t.is_selected !== false ? 1 : 0,
          order++
        ]);
      }

      res.json({ success: true, message: 'Term structure updated successfully!' });
    } catch (err) {
      next(err);
    }
  },

  // ── 4. Delete Term Structure ──
  async delete(req, res, next) {
    try {
      const conn = sutando.connection();
      const { id } = req.params;
      await conn.raw('DELETE FROM exam_term_structure_classes WHERE structure_id = ?', [id]);
      await conn.raw('DELETE FROM exam_terms WHERE structure_id = ?', [id]);
      await conn.raw('DELETE FROM exam_term_structures WHERE id = ?', [id]);
      res.json({ success: true, message: 'Term structure deleted successfully!' });
    } catch (err) {
      next(err);
    }
  }
};
