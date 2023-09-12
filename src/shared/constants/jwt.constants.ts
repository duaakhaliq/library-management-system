import 'dotenv/config';

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRE_IN,
};
