import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authServices';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.sendStatus(401);
    }

    try {
        const decoded = verifyToken(token);
        req.userId = (decoded as {id: string}).id;
        next();
    } catch (err) {
        return res.sendStatus(403).send(err);
    }
}
