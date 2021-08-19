import { BaseModel } from '../database';
class BudgetWallet extends BaseModel {
  static tableName = 'budget_wallets';

  static relationMappings = () => ({
    budget: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./budgets').default,
      join: {
        from: 'budget_swallets.budget_id',
        to: 'budgets.id',
      },
    },
    wallet: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require('./wallets').default,
      join: {
        from: 'budget_swallets.wallet_id',
        to: 'wallets.id',
      },
    },
  });
}

export default BudgetWallet;
