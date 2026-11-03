import { Model } from 'sutando';

export class Users extends Model {
  table = 'users';

  relationBranch() {
    return this.belongsTo('Branch', 'branch_id');
  }

  relationRole() {
    return this.belongsTo('Roles', 'role_id');
  }
}

export default Users;