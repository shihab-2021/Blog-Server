import jwt from "jsonwebtoken";

// creating jwt token
export const createToken = (jwtPayload, secret, expiresIn) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

// verify token
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
