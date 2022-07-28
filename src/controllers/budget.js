import Budget from '../models/budgets';
import BudgetSubCategory from '../models/budget_categories';
import BudgetWallet from '../models/budget_wallets';
import { validateAll } from '../utils/form';
import { conn } from '../database';

export const all = async (req, res) => {
  try {
    const budget = await Budget.query()
      .where((builder) => {
        if (req.query.name) {
          builder.where('name', 'LIKE', `${req.query.name}%`);
        }

        builder.whereNull('deleted_at');
      })
      .orderBy('id', 'DESC')
      .withGraphFetched('sub_category');

    return res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi kesalahan',
    });
  }
};
export const detail = async (req, res) => {
  try {
    const budget = await Budget.query()
      .findById(req.params.id)
      .whereNull('deleted_at')
      .first()
      .withGraphFetched('sub_category');

    return res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Terjadi kesalahan',
    });
  }
};

export const create = async (req, res) => {
  const rules = {
    name: 'required',
    category_ids: 'required',
    wallet_ids: 'required',
    amount: 'required',
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
      currency_id: req.body.currency_id,
      amount: req.body.amount,
      recurrence: req.body.recurrence,
    });

    const subCategoryIds = req.body.category_ids;
    const budgetSubCat = subCategoryIds.map((catId) => {
      return BudgetSubCategory.query(trx).insert({
        budget_id: budget.id,
        category_id: catId,
      });
    });
    await Promise.all(budgetSubCat);

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
      message: 'Gagal memasukkan data!',
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

    const subCategoryIds = req.body.sub_category_ids;
    const budgetSubCat = subCategoryIds.map((sub_category_ids) => {
      return BudgetSubCategory.query(trx)
        .patch({
          budget_id: req.params.id,
          sub_category_id: sub_category_ids,
        })
        .where('budget_id', req.params.id);
    });
    await Promise.all(budgetSubCat);

    const walletIds = req.body.wallet_ids;
    const budgetWallet = walletIds.map((wallet_ids) => {
      return BudgetWallet.query(trx)
        .patch({
          budget_id: req.params.id,
          wallet_id: wallet_ids,
        })
        .where('budget_id', req.params.id);
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
      message: 'Gagal memasukkan data!',
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const budget = await Budget.query().whereIn('id', req.body.ids).patch({
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
      message: 'Gagal menghapus!',
    });
  }
};
