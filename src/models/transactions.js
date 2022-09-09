import { BaseModel } from '../database';
class Transaction extends BaseModel {
  static tableName = 'transactions';

  static relationMappings = () => ({
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./users').default,
      join: {
        from: 'transactions.user_id',
        to: 'users.id',
      },
    },
    currency: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./currencies').default,
      join: {
        from: 'transactions.currency_id',
        to: 'currencies.id',
      },
    },
    category: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./categories').default,
      join: {
        from: 'transactions.category_id',
        to: 'categories.id',
      },
    },
    wallet: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./wallets').default,
      join: {
        from: 'transactions.wallet_id',
        to: 'wallets.id',
      },
    },
  });
}

export default Transaction;
