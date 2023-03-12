import { BaseModel } from "../database";
class Transaction extends BaseModel {
  static tableName = "transactions";

  static relationMappings = () => ({
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require("./users").default,
      join: {
        from: "transactions.user_id",
        to: "users.id",
      },
    },
    category: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require("./categories").default,
      join: {
        from: "transactions.category_id",
        to: "categories.id",
      },
    },
    wallet: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require("./wallets").default,
      join: {
        from: "transactions.wallet_id",
        to: "wallets.id",
      },
    },
    budget: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require("./budgets").default,
      join: {
        from: "transactions.budget_id",
        to: "budgets.id",
      },
    },
  });
}

export default Transaction;
