import { BaseModel } from '../database';
class BudgetCategory extends BaseModel {
  static tableName = 'budget_categories';

  static relationMappings = () => ({
    budget: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./budgets').default,
      join: {
        from: 'budget_categories.budget_id',
        to: 'budgets.id',
      },
    },
    category: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./categories').default,
      join: {
        from: 'budget_categories.category_id',
        to: 'categories.id',
      },
    },
  });
}

export default BudgetCategory;
