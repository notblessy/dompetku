import { BaseModel } from '../database';
class User extends BaseModel {
  static tableName = 'users';
}

export default User;
