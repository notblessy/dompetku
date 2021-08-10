import { nanoid } from 'nanoid';
import { paramCase } from 'change-case';
import Category from '../models/categories';
import { validateAll } from '../utils/form';

export const all = async (req, res) => {
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 10;

  try {
    const category = await Category.query()
      .where((builder) => {
        if (req.query.name) {
          builder.where('name', 'LIKE', `${req.query.name}%`);
        }

        builder.whereNull('deleted_at');
      })
      .orderBy('id', 'DESC')
      .page(page - 1, pageSize);

    return res.json({
      success: true,
      data: category.results,
      pagination: {
        page: page,
        pageSize: pageSize,
        total: category.total,
        hasNext: page < Math.floor(category.total / pageSize),
      },
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
    const category = await Category.query()
      .findById(req.params.id)
      .whereNull('deleted_at')
      .first();

    return res.json({
      success: true,
      data: category,
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
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  try {
    const category = await Category.query().insert({
      name: req.body.name,
      slug: `${nanoid()}-${paramCase(req.body.name)}`,
    });

    return res.json({
      success: true,
      data: category,
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
    const category = await Category.query().patchAndFetchById(req.params.id, {
      name: req.body.name,
      slug: `${nanoid()}-${paramCase(req.body.name)}`,
    });

    return res.json({
      success: true,
      data: category,
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
    const category = await Category.query().whereIn('id', req.body.ids).patch({
      deleted_at: new Date(),
    });

    return res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Gagal menghapus!',
    });
  }
};
