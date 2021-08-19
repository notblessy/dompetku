import { BaseModel } from '../database';
class Currency extends BaseModel {
  static tableName = 'currencies';

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

export default Currency;
