import User from '../models/users';

export const all = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const pageSize = +req.query.pageSize || 10;

    const user = await User.query()
      .where((builder) => {
        if (req.query.name) {
          builder.where('name', 'LIKE', `${req.query.name}%`);
        }

        builder.whereNull('deleted_at');
      })
      .whereNot('role', 'ADMIN')
      .orderBy('id', 'DESC')
      .page(page - 1, pageSize);

    return res.json({
      success: true,
      data: user.results,
      pagination: {
        page,
        pageSize,
        total: user.total,
        hasNext: page < Math.ceil(user.total / pageSize),
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
