import jwt, { SignOptions } from 'jsonwebtoken';
import auth from '../config/auth';

export const generateToken = (user_id: number): string => {
    const options: SignOptions = {
        expiresIn: auth.jwt.expiresIn,
        algorithm: 'HS256'
    };

    return jwt.sign({ id: user_id}, auth.jwt.secret, options);
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, auth.jwt.secret, { algorithms: ['HS256']});
    } catch (error){
        if (error instanceof Error) {
            throw new Error("Invalid Token!");
        }
    }

};
