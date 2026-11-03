import { Model } from 'sutando';

export class Users extends Model {
  table = 'users';
  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }
  role() {
    return this.belongsTo('Roles', 'role_id');
  }
}

export default Users;
