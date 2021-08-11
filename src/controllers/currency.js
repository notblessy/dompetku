import Currency from '../models/currencies';
import { validateAll } from '../utils/form';

export const all = async (req, res) => {
  try {
    const currency = await Currency.query();

    return res.json({
      success: true,
      data: currency,
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
    const currency = await Currency.query()
      .findById(req.params.id)
      .whereNull('deleted_at')
      .first();

    return res.json({
      success: true,
      data: currency,
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
    code: 'required',
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  try {
    const currency = await Currency.query().insert({
      name: req.body.name,
      slug: req.body.code,
    });

    return res.json({
      success: true,
      data: currency,
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
    const currency = await Currency.query().patchAndFetchById(req.params.id, {
      name: req.body.name,
      code: req.body.code,
    });

    return res.json({
      success: true,
      data: currency,
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
    const currency = await Currency.query().whereIn('id', req.body.ids).patch({
      deleted_at: new Date(),
    });

    return res.json({
      success: true,
      data: currency,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Gagal menghapus!',
    });
  }
};
