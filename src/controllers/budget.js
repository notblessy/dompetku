import Budget from "../models/budgets";
import BudgetCategory from "../models/budget_categories";
import BudgetWallet from "../models/budget_wallets";
import Transaction from "../models/transactions";
import { validateAll } from "../utils/form";
import { conn } from "../database";

export const all = async (req, res) => {
  try {
    const budgets = await Budget.knex().raw(`
      SELECT 
        b.id,
        b.name,
        b.amount,
        IFNULL(SUM(t.amount), 0) as total_transaction
      FROM budgets b
      LEFT JOIN budget_wallets bw
        ON b.id = bw.budget_id
      LEFT JOIN budget_categories bc
        ON b.id = bc.budget_id
      LEFT JOIN transactions t
        ON t.wallet_id = bw.wallet_id AND t.category_id = bc.category_id AND t.budget_id = b.id
      GROUP BY b.id
    `);

    const budgetData = budgets.length > 0 ? budgets[0] : [];
    const results = budgetData.map((d) => {
      const progress = (d.total_transaction / d.amount) * 100;
      return {
        id: d.id,
        name: d.name,
        amount: d.amount,
        total_transaction: d.total_transaction,
        progress: Math.floor(progress),
        left_out: d.amount - d.total_transaction,
      };
    });

    return res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Terjadi kesalahan",
    });
  }
};
export const detail = async (req, res) => {
  try {
    const budget = await Budget.query()
      .findById(req.params.id)
      .whereNull("deleted_at")
      .first()
      .withGraphFetched("category");

    return res.json({
      success: true,
      data: budget,
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
    name: "required",
    category_ids: "required",
    wallet_ids: "required",
    amount: "required",
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }
  const trx = await conn.transaction();
  try {
    const budget = await Budget.query(trx).insert({
      name: req.body.name,
      user_id: req.user.id,
      amount: req.body.amount,
      recurrence: req.body.recurrence,
    });

    const categoryIds = req.body.category_ids;
    const budgetCat = categoryIds.map((catId) => {
      return BudgetCategory.query(trx).insert({
        budget_id: budget.id,
        category_id: catId,
      });
    });
    await Promise.all(budgetCat);

    const walletIds = req.body.wallet_ids;
    const budgetWallet = walletIds.map((wallet_ids) => {
      return BudgetWallet.query(trx).insert({
        budget_id: budget.id,
        wallet_id: wallet_ids,
      });
    });
    await Promise.all(budgetWallet);

    await trx.commit();
    return res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error(error);
    await trx.rollback();
    return res.json({
      success: false,
      message: "Gagal memasukkan data!",
    });
  }
};

export const edit = async (req, res) => {
  const trx = await conn.transaction();
  try {
    const budget = await Budget.query(trx).patchAndFetchById(req.params.id, {
      name: req.body.name,
      user_id: req.user.id,
      currency_id: req.body.currency_id,
      amount: req.body.amount,
      recurrence: req.body.recurrence,
    });

    const categoryIds = req.body.sub_category_ids;
    const budgetCat = categoryIds.map((sub_category_ids) => {
      return BudgetCategory.query(trx)
        .patch({
          budget_id: req.params.id,
          sub_category_id: sub_category_ids,
        })
        .where("budget_id", req.params.id);
    });
    await Promise.all(budgetCat);

    const walletIds = req.body.wallet_ids;
    const budgetWallet = walletIds.map((wallet_ids) => {
      return BudgetWallet.query(trx)
        .patch({
          budget_id: req.params.id,
          wallet_id: wallet_ids,
        })
        .where("budget_id", req.params.id);
    });
    await Promise.all(budgetWallet);

    await trx.commit();
    return res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error(error);
    await trx.rollback();
    return res.json({
      success: false,
      message: "Gagal memasukkan data!",
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const budget = await Budget.query().whereIn("id", req.body.ids).patch({
      deleted_at: new Date(),
    });

    return res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Gagal menghapus!",
    });
  }
};
