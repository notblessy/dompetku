import { BaseModel } from '../database';
class SubCategory extends BaseModel {
  static tableName = 'sub_categories';

  static relationMappings = () => ({
    category: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./categories').default,
      join: {
        from: 'sub_categories.category_id',
        to: 'categories.id',
      },
    },
  });
}

export default SubCategory;
