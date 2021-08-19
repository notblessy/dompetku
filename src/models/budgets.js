import { BaseModel } from '../database';
class Budget extends BaseModel {
  static tableName = 'budgets';

  static relationMappings = () => ({
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./users').default,
      join: {
        from: 'budgets.user_id',
        to: 'users.id',
      },
    },
    currency: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./currencies').default,
      join: {
        from: 'budgets.currency_id',
        to: 'currencies.id',
      },
    },
    budget_sub_category: {
      relation: BaseModel.HasManyRelation,
      modelClass: require('./budget_sub_categories').default,
      join: {
        from: 'budgets.id',
        to: 'budget_sub_category.budget_id',
      },
    },
  });
}

export default Budget;
