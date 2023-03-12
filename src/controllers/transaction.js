import { validateAll } from "../utils/form";
import Transaction from "../models/transactions";

export const all = async (req, res) => {
  try {
    const transaction = await Transaction.query()
      .where((builder) => {
        if (req.query.budget_id) {
          builder.where("budget_id", req.query.budget_id);
        }

        if (req.query.wallet_id) {
          builder.where("wallet_id", req.query.wallet_id);
        }

        builder.whereNull("transactions.deleted_at");
      })
      .withGraphJoined("wallet", { joinOperation: "leftJoin" })
      .withGraphJoined("category", { joinOperation: "leftJoin" })
      .withGraphJoined("budget", { joinOperation: "leftJoin" })
      .withGraphJoined("user", { joinOperation: "leftJoin" })
      .orderBy("spent_at", "DESC");

    return res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Terjadi kesalahan",
    });
  }
};

export const create = async (req, res) => {
  const rules = {
    amount: "required",
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  try {
    const transaction = await Transaction.query().insert({
      user_id: req.user.id,
      wallet_id: req.body.wallet_id,
      category_id: req.body.category_id,
      budget_id: req.body.budget_id,
      amount: req.body.amount,
      spent_at: new Date(req.body.amount),
    });

    return res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Insert failed!",
    });
  }
};
