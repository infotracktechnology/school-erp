import { Model } from 'sutando';

export class Branch extends Model {
  table = 'branches';

  organization() {
    return this.belongsTo('Organization', 'organization_id');
  }

  academicYears() {
    return this.hasMany('AcademicYear', 'branch_id');
  }

  classes() {
    return this.hasMany('Class', 'branch_id');
  }

  students() {
    return this.hasMany('Student', 'branch_id');
  }

  subjects() {
    return this.hasMany('Subject', 'branch_id');
  }
}

export default Branch;
