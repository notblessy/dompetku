import { BaseModel } from '../database';
class BudgetSubCategory extends BaseModel {
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
    sub_category: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./categories').default,
      join: {
        from: 'budget_categories.sub_category_id',
        to: 'sub_categories.id',
      },
    },
  });
}

export default BudgetSubCategory;
