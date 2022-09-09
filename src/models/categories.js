import { BaseModel } from '../database';
class Category extends BaseModel {
  static tableName = 'categories';

  static relationMappings = () => ({
    budget_categories: {
      relation: BaseModel.HasManyRelation,
      modelClass: require('./budget_categories').default,
      join: {
        from: 'categories.id',
        to: 'budget_categories.category_id',
      },
    },
    transactions: {
      relation: BaseModel.HasManyRelation,
      modelClass: require('./transactions').default,
      join: {
        from: 'categories.id',
        to: 'transactions.category_id',
      },
    },
  });
}

export default Category;
