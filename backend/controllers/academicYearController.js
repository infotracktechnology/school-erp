import { AcademicYear } from '../models/AcademicYear.js';

function formatAcademicYear(ay, branch_id) {
  const isCurrent = Boolean(ay.is_active === 1 || ay.is_current === 1 || ay.is_active === true);
  const isEnabled = Boolean(ay.is_enabled !== 0 && ay.is_enabled !== false);
  const isNext = Boolean(ay.is_next === 1 || ay.is_next === true);
  let status = ay.status;
  if (!status) {
    status = isCurrent ? 'Active' : 'Upcoming';
  }

  let branchDates = ay.branch_dates;
  if (typeof branchDates === 'string') {
    try {
      branchDates = JSON.parse(branchDates);
    } catch (e) {
      branchDates = [];
    }
  }
  if (!Array.isArray(branchDates)) {
    branchDates = [];
  }

  let startDate = ay.start_date;
  let endDate = ay.end_date;
  let branchName = ay.branch_name || null;

  if (branch_id && branch_id !== 'all' && branchDates.length > 0) {
    const match = branchDates.find((b) => String(b.branch_id) === String(branch_id));
    if (match) {
      if (match.start_date) startDate = match.start_date;
      if (match.end_date) endDate = match.end_date;
      if (match.status) status = match.status;
      if (match.branch_name) branchName = match.branch_name;
    }
  }

  let displayStatus = isEnabled ? 'Enabled' : 'Disabled';
  if (isCurrent) {
    displayStatus = 'Current / Default';
  } else if (isNext && isEnabled) {
    displayStatus = 'Next Year / Enabled';
  } else if (!isEnabled) {
    displayStatus = 'Disabled';
  }

  return {
    ...ay,
    name: ay.name || ay.year_name || 'Academic Year',
    year_name: ay.year_name || ay.name,
    start_date: startDate,
    end_date: endDate,
    branch_name: branchName,
    branch_dates: branchDates,
    status: status,
    display_status: displayStatus,
    is_current: isCurrent ? 1 : 0,
    is_enabled: isEnabled ? 1 : 0,
    is_next: isNext ? 1 : 0,
  };
}

export const academicYearController = {
  async list(req, res, next) {
    try {
      const { branch_id, status } = req.query;
      // Fetch unique academic years across the ERP
      const rawList = await AcademicYear.query().orderBy('start_date', 'asc').get();
      const listArray = rawList.all ? rawList.all() : (Array.isArray(rawList) ? rawList : []);
      const formatted = listArray.map((ay) => {
        const json = typeof ay.toJSON === 'function' ? ay.toJSON() : ay;
        return formatAcademicYear(json, branch_id);
      });

      let filtered = formatted;
      if (status && status !== 'all') {
        filtered = formatted.filter((y) => y.status?.toLowerCase() === status.toLowerCase());
      }

      res.json({ success: true, data: filtered });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const { branch_id } = req.query;
      const year = await AcademicYear.query().find(req.params.id);
      if (!year) return res.status(404).json({ success: false, message: 'Academic Year not found' });
      const json = typeof year.toJSON === 'function' ? year.toJSON() : year;
      res.json({ success: true, data: formatAcademicYear(json, branch_id) });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const payload = { ...req.body };
      if (payload.name && !payload.year_name) payload.year_name = payload.name;
      if (!payload.name && payload.year_name) payload.name = `Academic Year ${payload.year_name}`;
      if (!payload.status) payload.status = payload.is_current ? 'Active' : 'Upcoming';
      if (payload.is_enabled === undefined) payload.is_enabled = 1;
      if (payload.is_next === undefined) payload.is_next = 0;
      if (Array.isArray(payload.branch_dates)) {
        payload.branch_dates = JSON.stringify(payload.branch_dates);
      }

      const year = await AcademicYear.query().create(payload);
      res.status(201).json({ success: true, data: formatAcademicYear(year.toJSON ? year.toJSON() : year) });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const year = await AcademicYear.query().find(req.params.id);
      if (!year) return res.status(404).json({ success: false, message: 'Academic Year not found' });
      const payload = { ...req.body };
      if (payload.name && !payload.year_name) payload.year_name = payload.name;
      if (Array.isArray(payload.branch_dates)) {
        payload.branch_dates = JSON.stringify(payload.branch_dates);
      }
      await year.update(payload);
      res.json({ success: true, data: formatAcademicYear(year.toJSON ? year.toJSON() : year) });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const year = await AcademicYear.query().find(req.params.id);
      if (!year) return res.status(404).json({ success: false, message: 'Academic Year not found' });
      const newStatus = req.body.status || 'Active';
      const isActive = newStatus === 'Active' ? 1 : 0;
      await year.update({ status: newStatus, is_active: isActive });
      res.json({ success: true, data: formatAcademicYear(year.toJSON ? year.toJSON() : year), message: 'Status updated' });
    } catch (err) {
      next(err);
    }
  },

  async setCurrent(req, res, next) {
    try {
      const year = await AcademicYear.query().find(req.params.id);
      if (!year) return res.status(404).json({ success: false, message: 'Academic Year not found' });
      // Clear other active/current years
      await AcademicYear.query().update({ is_active: 0, is_current: 0 });
      // Set this year as current and active
      await year.update({ is_active: 1, is_current: 1, is_enabled: 1, is_next: 0, status: 'Active' });
      res.json({ success: true, data: formatAcademicYear(year.toJSON ? year.toJSON() : year), message: 'Set as current academic year' });
    } catch (err) {
      next(err);
    }
  },

  async setNext(req, res, next) {
    try {
      const year = await AcademicYear.query().find(req.params.id);
      if (!year) return res.status(404).json({ success: false, message: 'Academic Year not found' });
      // Reset other is_next across ERP
      await AcademicYear.query().update({ is_next: 0 });
      // Set this year as next and ensure it is enabled
      await year.update({ is_next: 1, is_enabled: 1 });
      res.json({ success: true, data: formatAcademicYear(year.toJSON ? year.toJSON() : year), message: 'Set as next academic year for promotion' });
    } catch (err) {
      next(err);
    }
  },

  async toggleEnabled(req, res, next) {
    try {
      const year = await AcademicYear.query().find(req.params.id);
      if (!year) return res.status(404).json({ success: false, message: 'Academic Year not found' });
      const currentVal = year.is_enabled !== undefined ? year.is_enabled : 1;
      const newState = req.body.is_enabled !== undefined ? (req.body.is_enabled ? 1 : 0) : (currentVal ? 0 : 1);
      await year.update({ is_enabled: newState });
      res.json({ success: true, data: formatAcademicYear(year.toJSON ? year.toJSON() : year), message: 'Toggled enabled state' });
    } catch (err) {
      next(err);
    }
  },

  async getNextAcademicYear(req, res, next) {
    try {
      const { branch_id, current_academic_year_id } = req.query;

      // 1. Find the reference/current year
      let currentYear = null;
      if (current_academic_year_id && current_academic_year_id !== 'undefined') {
        currentYear = await AcademicYear.query().find(Number(current_academic_year_id));
      }
      if (!currentYear) {
        currentYear = await AcademicYear.query().where('is_current', 1).orWhere('is_active', 1).first();
      }

      // 2. Find the next academic year following this reference year
      let nextYear = null;
      if (currentYear && currentYear.start_date) {
        const rawCandidates = await AcademicYear.query()
          .where('start_date', '>', currentYear.start_date)
          .orderBy('start_date', 'asc')
          .get();
        const candList = rawCandidates.all ? rawCandidates.all() : (Array.isArray(rawCandidates) ? rawCandidates : []);
        if (candList.length > 0) {
          nextYear = candList.find(y => y.is_next === 1) || candList[0];
        }
      }

      if (!nextYear) {
        nextYear = await AcademicYear.query()
          .where('is_next', 1)
          .first();
      }

      if (nextYear) {
        const json = nextYear.toJSON ? nextYear.toJSON() : nextYear;
        const formatted = formatAcademicYear(json, branch_id);
        const isEnabled = Boolean(formatted.is_enabled);
        return res.json({
          success: true,
          data: formatted,
          is_enabled: isEnabled,
          is_configured: true,
          message: isEnabled
            ? 'Next academic year identified successfully.'
            : `The next academic year (${formatted.name}) is not enabled for this branch. Please enable the academic year in Academic Year Settings before proceeding with promotion.`
        });
      }

      return res.json({
        success: false,
        data: null,
        is_enabled: false,
        is_configured: false,
        message: 'No subsequent academic year configured for this branch. Please configure the academic year in Academic Year Settings before proceeding with promotion.'
      });
    } catch (err) {
      next(err);
    }
  }
};

export default academicYearController;
