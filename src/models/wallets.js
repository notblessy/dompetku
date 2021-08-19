import { BaseModel } from '../database';
class Wallet extends BaseModel {
  static tableName = 'wallets';

  static relationMappings = () => ({
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./users').default,
      join: {
        from: 'wallets.user_id',
        to: 'users.id',
      },
    },
    currency: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./currencies').default,
      join: {
        from: 'wallets.currency_id',
        to: 'currencies.id',
      },
    },
    budget_wallet: {
      relation: BaseModel.HasManyRelation,
      modelClass: require('./budget_wallets').default,
      join: {
        from: 'wallets.id',
        to: 'budget_wallets.wallet_id',
      },
    },
  });
}

export default Wallet;
