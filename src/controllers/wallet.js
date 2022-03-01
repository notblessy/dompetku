import Wallet from '../models/wallets';
import { validateAll } from '../utils/form';

export const all = async (req, res) => {
  try {
    const wallet = await Wallet.query()
      .where((builder) => {
        if (req.query.name) {
          builder.where('name', 'LIKE', `${req.query.name}%`);
        }

        builder.whereNull('deleted_at');
      })
      .orderBy('id', 'DESC')
      .withGraphFetched('user');

    return res.json({
      success: true,
      data: wallet,
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
    const wallet = await Wallet.query()
      .findById(req.params.id)
      .whereNull('deleted_at')
      .first();

    return res.json({
      success: true,
      data: wallet,
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
    initial_balance: 'required',
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  try {
    const wallet = await Wallet.query().insert({
      name: req.body.name,
      currency_id: req.body.currency_id,
      initial_balance: req.body.initial_balance,
      user_id: req.user.id,
    });

    return res.json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Gagal memasukkan data!',
    });
  }
};

export const edit = async (req, res) => {
  try {
    const wallet = await Wallet.query().patchAndFetchById(req.params.id, {
      name: req.body.name,
      currency_id: req.body.currency_id,
      initial_balance: req.body.initial_balance,
      user_id: req.user.id,
    });

    return res.json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Gagal memasukkan data!',
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const wallet = await Wallet.query().whereIn('id', req.body.ids).patch({
      deleted_at: new Date(),
    });

    return res.json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Gagal menghapus!',
    });
  }
};
