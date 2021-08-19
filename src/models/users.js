import { BaseModel } from '../database';
class User extends BaseModel {
  static tableName = 'users';

  static relationMappings = () => ({
    budget: {
      relation: BaseModel.HasManyRelation,
      modelClass: require('./budgets').default,
      join: {
        from: 'currencies.id',
        to: 'budgets.currency_id',
      },
    },
  });
}

export default User;
