import { BaseModel } from '../database';
class BudgetSubCategory extends BaseModel {
  static tableName = 'budget_sub_categories';

  static relationMappings = () => ({
    budget: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./budgets').default,
      join: {
        from: 'budget_sub_categories.budget_id',
        to: 'budgets.id',
      },
    },
    sub_category: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./sub_categories').default,
      join: {
        from: 'budget_sub_categories.sub_category_id',
        to: 'sub_categories.id',
      },
    },
  });
}

export default BudgetSubCategory;
