import { sutando } from '../config/database.js';

const knex = (table) => sutando.connection().table(table);

export const dashboardController = {
  async superAdmin(req, res, next) {
    try {
      const { branch_id, academic_year_name, academic_year_id } = req.query;
      let ayId = Number(academic_year_id);
      if ((!ayId || isNaN(ayId)) && academic_year_name) {
        const ayRow = await knex('academic_years').where('year_name', academic_year_name).first();
        if (ayRow) ayId = ayRow.id;
      }

      let stuQuery = knex('students as s').leftJoin('sections as sec', 's.section_id', 'sec.id');
      let branchQuery = knex('branches');
      let classQuery = knex('classes');

      if (branch_id && branch_id !== 'all' && !isNaN(Number(branch_id))) {
        stuQuery = stuQuery.where('s.branch_id', Number(branch_id));
        branchQuery = branchQuery.where('id', Number(branch_id));
      }
      if (ayId && !isNaN(ayId)) {
        stuQuery = stuQuery.where('sec.academic_year_id', ayId);
      }

      const totalStudents = await stuQuery.count('s.id', { as: 'count' });
      const totalBranches = await branchQuery.count('id', { as: 'count' });
      const totalClasses = await classQuery.count('id', { as: 'count' });
      const totalStaff = await knex('users').whereIn('role_id', [1, 2, 3]).count('id', { as: 'count' });

      const sCount = Number(totalStudents) || (totalStudents[0]?.count ? Number(totalStudents[0].count) : 0);
      const bCount = Number(totalBranches) || (totalBranches[0]?.count ? Number(totalBranches[0].count) : 0);
      const cCount = Number(totalClasses) || (totalClasses[0]?.count ? Number(totalClasses[0].count) : 0);
      const stCount = Number(totalStaff) || (totalStaff[0]?.count ? Number(totalStaff[0].count) : 0);

      res.json({
        success: true,
        data: {
          metrics: {
            total_students: sCount,
            total_branches: bCount,
            total_classes: cCount,
            total_staff: stCount,
            active_students: sCount,
            today_attendance_percentage: 95.0,
          },
          summary: {
            total_students: sCount,
            total_branches: bCount,
            total_classes: cCount,
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
