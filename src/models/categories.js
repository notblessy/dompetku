import { BaseModel } from '../database';
class Category extends BaseModel {
  static tableName = 'categories';

  static relationMappings = () => ({
    sub_category: {
      relation: BaseModel.HasManyRelation,
      modelClass: require('./sub_categories').default,
      join: {
        from: 'categories.id',
        to: 'sub_categories.category_id',
      },
    },
  });
}

export default Category;
