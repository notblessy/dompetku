import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { OAuth2Client } from 'google-auth-library';

import config from '../config';
import User from '../models/users';
import { validateAll } from '../utils/form';

export const register = async (req, res) => {
  const rules = {
    name: 'required',
    email: 'required|email',
    password: 'required',
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
    const existing = await User.query().findOne({
      email: req.body.email,
    });
    if (existing) {
      return res.json({
        success: false,
        message: 'Email sudah terdaftar.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    const userID = nanoid();
    const data = await User.query(trx).insert({
      email: req.body.email,
      name: req.body.name,
      role: 'USER',
      id: userID,
      password: hashed,
    });

    const payload = {
      id: data.id,
      user_claims: {
        id: data.id,
        email: data.email,
        name: data.name,
      },
    };

    const jwtOptions = {
      issuer: config.JWT_ISSUER,
      subject: 'access',
      algorithm: config.JWT_ALGORITHM,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, jwtOptions);

    await trx.commit();

    return res.json({
      type: 'Bearer',
      token: token,
      data: data,
    });
  } catch (error) {
    await trx.rollback();
    console.error(error);

    return res.json({
      success: false,
      message: 'Something went wrong.',
    });
  }
};

export const login = async (req, res) => {
  const rules = {
    id_token: 'required',
    role: 'in:USER,ADMIN',
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  try {
    const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: req.body.id_token,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const googlePayload = ticket.getPayload();

    const jwtOptions = {
      issuer: 'api.dompetku.id',
      subject: 'access',
      algorithm: config.JWT_ALGORITHM,
    };

    const data = await User.query().where('email', googlePayload.email).first();
    if (!data) {
      const newUser = await User.query().insert({
        email: googlePayload.email,
        name: googlePayload.name,
        picture: googlePayload.picture,
        role: req.body.role,
        id: nanoid(),
      });

      if (!newUser) {
        return res.json({
          success: false,
          message: 'Registration failed!',
        });
      }

      const payload = {
        id: newUser.id,
        user_claims: {
          id: newUser.id,
          email: googlePayload.email,
          role: newUser.role,
        },
      };

      const token = jwt.sign(payload, config.JWT_SECRET, jwtOptions);

      return res.json({
        type: 'Bearer',
        token: token,
        data: newUser,
      });
    }

    const payload = {
      id: data.id,
      user_claims: {
        id: data.id,
        email: data.email,
        role: data.role,
      },
    };

    const token = jwt.sign(payload, config.JWT_SECRET, jwtOptions);

    return res.json({
      type: 'Bearer',
      token: token,
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Something went wrong.',
    });
  }
};

export const loginAdmin = async (req, res) => {
  const rules = {
    email: 'required',
    password: 'required',
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  try {
    const existing = await User.query().findOne({
      email: req.body.email,
    });

    if (!existing) {
      return res.json({
        success: false,
        message: 'Email not found!',
      });
    }

    if (existing !== 'ADMIN') {
      return res.json({
        success: false,
        message: 'Access denied',
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, existing.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: 'Password did not match',
      });
    }

    const payload = {
      id: existing.id,
      user_claims: {
        id: existing.id,
        email: existing.email,
        role: existing.role,
      },
    };

    const jwtOptions = {
      issuer: config.JWT_ISSUER,
      subject: 'access',
      algorithm: config.JWT_ALGORITHM,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, jwtOptions);

    return res.json({
      success: true,
      type: 'Bearer',
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Something went wrong.',
    });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.query().findById(req.user.id);

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Something went wrong.',
    });
  }
};

export const edit = async (req, res) => {
  try {
    const user = await User.query().patchAndFetchById(req.user.id, {
      name: req.body.name,
      picture: req.body.picture,
    });
    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Something went wrong.',
    });
  }
};
