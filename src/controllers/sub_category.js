import SubCategory from '../models/sub_categories';
import { validateAll } from '../utils/form';

export const all = async (req, res) => {
  try {
    const subCategory = await SubCategory.query()
      .where((builder) => {
        if (req.query.name) {
          builder.where('name', 'LIKE', `${req.query.name}%`);
        }

        builder.whereNull('deleted_at');
      })
      .orderBy('id', 'DESC')
      .withGraphFetched('category');

    return res.json({
      success: true,
      data: subCategory,
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
    const subCategory = await SubCategory.query()
      .findById(req.params.id)
      .whereNull('deleted_at')
      .withGraphFetched('category')
      .first();

    return res.json({
      success: true,
      data: subCategory,
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
    const subCategory = await SubCategory.query().insert({
      name: req.body.name,
      picture: req.body.picture,
      category_id: req.body.category_id,
    });

    return res.json({
      success: true,
      data: subCategory,
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
    const subCategory = await SubCategory.query().patchAndFetchById(
      req.params.id,
      {
        name: req.body.name,
        picture: req.body.picture,
        category_id: req.body.category_id,
      }
    );

    return res.json({
      success: true,
      data: subCategory,
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
    const subCategory = await SubCategory.query()
      .whereIn('id', req.body.ids)
      .patch({
        deleted_at: new Date(),
      });

    return res.json({
      success: true,
      data: subCategory,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Gagal menghapus!',
    });
  }
};
