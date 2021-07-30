import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { OAuth2Client } from 'google-auth-library';

import config from '../config';
import User from '../models/users';
import { validateAll } from '../utils/form';

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
          message: 'Registrasi gagal. Gagal mendaftar',
        });
      }

      const payload = {
        identity: newUser.id,
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
      identity: data.id,
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
      message: 'Terjadi kesalahan',
    });
  }
};
