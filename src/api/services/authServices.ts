import jwt from 'jsonwebtoken';
import auth from '../config/auth';

export const generateToken = (user_id: string) => {
    return jwt.sign({ id: user_id}, auth.jwt.secret, {
        expiresIn: auth.jwt.expiresIn,
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, auth.jwt.secret);
};
