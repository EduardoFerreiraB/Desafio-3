import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authServices';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = verifyToken(token) as { id: number }; // Definindo tipo esperado
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        if (error instanceof Error) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        return res.status(500).json({message: "Internal server error"});
    }
}
