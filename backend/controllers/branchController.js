import { Branch } from '../models/Branch.js';

export const branchController = {
  async list(req, res, next) {
    try {
      const { status, board, search } = req.query;
      let query = Branch.query();

      if (status && status !== 'all') {
        query = query.where('status', status);
      }
      if (board && board !== 'all') {
        query = query.where('board', board);
      }
      if (search) {
        query = query.where((q) => {
          q.where('branch_name', 'like', `%${search}%`)
            .orWhere('branch_code', 'like', `%${search}%`)
            .orWhere('city', 'like', `%${search}%`);
        });
      }

      const branches = await query.orderBy('created_at', 'desc').get();
      res.json({ success: true, data: branches });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const branch = await Branch.query().find(req.params.id);
      if (!branch) {
        return res.status(404).json({ success: false, message: 'Branch not found' });
      }
      res.json({ success: true, data: branch });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const branch = await Branch.query().create(req.body);
      res.status(201).json({ success: true, data: branch, message: 'Branch created successfully' });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const branch = await Branch.query().find(req.params.id);
      if (!branch) {
        return res.status(404).json({ success: false, message: 'Branch not found' });
      }
      await branch.update(req.body);
      res.json({ success: true, data: branch, message: 'Branch updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const branch = await Branch.query().find(req.params.id);
      if (!branch) {
        return res.status(404).json({ success: false, message: 'Branch not found' });
      }
      await branch.update({ status: req.body.status });
      res.json({ success: true, data: branch, message: 'Branch status updated' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const branch = await Branch.query().find(req.params.id);
      if (!branch) {
        return res.status(404).json({ success: false, message: 'Branch not found' });
      }
      await branch.delete();
      res.json({ success: true, message: 'Branch deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};
