import jwt from 'jsonwebtoken';

import config from '../config/config';

type TokenPayload = {
  id: string;
  email: string;
  name: string;
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
};
