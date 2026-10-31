import { sutando } from '../config/database.js';

const knex = (table) => sutando.connection().table(table);

export const dashboardController = {
  async superAdmin(req, res, next) {
    try {
      const { branch_id, academic_year_name, academic_year_id } = req.query;
      const bId = Number(branch_id);
      const ayId = Number(academic_year_id);
      const ayStr = (academic_year_name || req.query.academic_year || '').trim();

      // Resolve academic year row supporting both year_name (e.g. '2025-2026') and name (e.g. 'Academic Year 2025-2026')
      let ayRow = null;
      if (ayStr && ayStr !== 'all' && ayStr !== 'undefined') {
        ayRow = await knex('academic_years')
          .where('year_name', ayStr)
          .orWhere('name', ayStr)
          .first();
      } else if (!isNaN(ayId) && ayId > 0 && academic_year_id !== 'all' && academic_year_id !== 'undefined') {
        ayRow = await knex('academic_years').where('id', ayId).first();
      }
      if (!ayRow) {
        ayRow = await knex('academic_years').where('is_current', 1).orWhere('is_active', 1).first();
      }

      const effectiveAyId = ayRow ? Number(ayRow.id) : (ayId || null);
      const effectiveAyStr = ayRow ? (ayRow.year_name || ayRow.name) : (ayStr || null);

      let stuQuery = knex('students as s').leftJoin('sections as sec', 's.section_id', 'sec.id');
      let activeStuQuery = knex('students as s').leftJoin('sections as sec', 's.section_id', 'sec.id').where('s.status', 'Active');
      let branchQuery = knex('branches');
      let classQuery = knex('classes');
      let secQuery = knex('sections');

      if (!isNaN(bId) && bId > 0 && branch_id !== 'all') {
        stuQuery = stuQuery.where('s.branch_id', bId);
        activeStuQuery = activeStuQuery.where('s.branch_id', bId);
        branchQuery = branchQuery.where('id', bId);
        classQuery = classQuery.where((q) => {
          q.where('branch_id', bId).orWhereNull('branch_id');
        });
        secQuery = secQuery.where('branch_id', bId);
      }

      if (effectiveAyStr || effectiveAyId) {
        stuQuery = stuQuery.where((builder) => {
          if (effectiveAyStr) {
            builder.where('s.academic_year', effectiveAyStr)
                   .orWhere('sec.academic_year', effectiveAyStr);
          }
          if (effectiveAyId) {
            builder.orWhere('s.academic_year_id', effectiveAyId)
                   .orWhere('sec.academic_year_id', effectiveAyId);
          }
        });

        activeStuQuery = activeStuQuery.where((builder) => {
          if (effectiveAyStr) {
            builder.where('s.academic_year', effectiveAyStr)
                   .orWhere('sec.academic_year', effectiveAyStr);
          }
          if (effectiveAyId) {
            builder.orWhere('s.academic_year_id', effectiveAyId)
                   .orWhere('sec.academic_year_id', effectiveAyId);
          }
        });
      }

      const totalStudents = await stuQuery.count('s.id', { as: 'count' });
      const activeStudents = await activeStuQuery.count('s.id', { as: 'count' });
      const totalBranches = await branchQuery.count('id', { as: 'count' });
      const totalClasses = await classQuery.count('id', { as: 'count' });
      const totalSections = await secQuery.count('id', { as: 'count' });
      const totalStaff = await knex('users').whereIn('role_id', [1, 2, 3]).count('id', { as: 'count' });

      const sCount = Number(totalStudents) || (totalStudents[0]?.count ? Number(totalStudents[0].count) : 0);
      const aCount = Number(activeStudents) || (activeStudents[0]?.count ? Number(activeStudents[0].count) : 0);
      const inCount = Math.max(0, sCount - aCount);
      const bCount = Number(totalBranches) || (totalBranches[0]?.count ? Number(totalBranches[0].count) : 0);
      const cCount = Number(totalClasses) || (totalClasses[0]?.count ? Number(totalClasses[0].count) : 0);
      const secCount = Number(totalSections) || (totalSections[0]?.count ? Number(totalSections[0].count) : 0);
      const stCount = Number(totalStaff) || (totalStaff[0]?.count ? Number(totalStaff[0].count) : 0);

      res.json({
        success: true,
        data: {
          metrics: {
            total_students: sCount,
            total_branches: bCount,
            total_classes: cCount,
            total_sections: secCount,
            total_staff: stCount,
            active_students: aCount,
            inactive_students: inCount,
            today_attendance_percentage: 95.0,
          },
          summary: {
            total_students: sCount,
            total_branches: bCount,
            total_classes: cCount,
            total_sections: secCount,
          }
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async drillDown(req, res, next) {
    try {
      res.json({ success: true, data: [] });
    } catch (err) {
      next(err);
    }
  }
};

export default dashboardController;
