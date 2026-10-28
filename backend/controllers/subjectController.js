import { Subject } from '../models/Subject.js';

function formatSubject(s) {
  return {
    ...s,
    name: s.name || s.subject_name,
    code: s.code || s.subject_code,
    subject_name: s.subject_name || s.name,
    subject_code: s.subject_code || s.code,
    subject_type: s.type || s.subject_type || 'Core',
    status: s.status || 'Active',
  };
}

export const subjectController = {
  async list(req, res, next) {
    try {
      const raw = await Subject.query().orderBy('id', 'asc').get();
      const listArray = raw.all ? raw.all() : (Array.isArray(raw) ? raw : []);
      const formatted = listArray.map((s) => {
        const json = typeof s.toJSON === 'function' ? s.toJSON() : s;
        return formatSubject(json);
      });
      res.json({ success: true, data: formatted });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const item = await Subject.query().find(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Subject not found' });
      const json = typeof item.toJSON === 'function' ? item.toJSON() : item;
      res.json({ success: true, data: formatSubject(json) });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const payload = {
        subject_name: req.body.subject_name || req.body.name,
        subject_code: req.body.subject_code || req.body.code,
        type: req.body.type || req.body.subject_type || 'Core',
      };
      const item = await Subject.query().create(payload);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const item = await Subject.query().find(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Subject not found' });
      const payload = {};
      if (req.body.name || req.body.subject_name) payload.subject_name = req.body.subject_name || req.body.name;
      if (req.body.code || req.body.subject_code) payload.subject_code = req.body.subject_code || req.body.code;
      if (req.body.type || req.body.subject_type) payload.type = req.body.type || req.body.subject_type;
      await item.update(payload);
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const item = await Subject.query().find(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Subject not found' });
      res.json({ success: true, data: item, message: 'Subject status updated' });
    } catch (err) {
      next(err);
    }
  }
};

export default subjectController;
