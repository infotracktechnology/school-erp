import { sutando } from '../config/database.js';

const knex = (table) => sutando.connection().table(table);

export const subjectCategoryController = {
  async list(req, res, next) {
    try {
      const { board, status } = req.query;
      let query = knex('subject_categories');

      if (board && board !== 'all' && board !== 'All Boards') {
        query = query.where('board', board);
      }
      if (status && status !== 'all') {
        query = query.where('status', status);
      }

      const rows = await query.orderBy('display_order', 'asc').orderBy('name', 'asc');
      res.json({ success: true, data: rows });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name, code, board = 'CBSE', display_order = 1, status = 'Active' } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
      }

      const now = new Date();
      const [id] = await knex('subject_categories').insert({
        name: name.trim(),
        code: code ? code.trim().toUpperCase() : name.trim().slice(0, 4).toUpperCase(),
        board,
        display_order: Number(display_order) || 1,
        status,
        created_at: now,
        updated_at: now,
      });

      const item = await knex('subject_categories').where('id', id).first();
      res.status(201).json({ success: true, data: item, message: 'Subject category created successfully' });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await knex('subject_categories').where('id', id).update({
        status,
        updated_at: new Date(),
      });
      res.json({ success: true, message: 'Subject category status updated successfully' });
    } catch (err) {
      next(err);
    }
  }
};

export default subjectCategoryController;
