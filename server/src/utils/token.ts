import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

// Déclare une interface pour l'utilisateur attaché à la requête
interface UserPayload {
  sessionId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Ajout du type `user` à la requête
    }
  }
}

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token de l'en-tête Authorization

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET || 'defaultAccessSecret') as UserPayload;
    req.user = payload; // Ajouter le payload du token à la requête pour l'utiliser dans les prochaines étapes
    next();
  } catch (err) {
    console.error('Invalid access token:', err);
    return res.status(403).json({ error: 'Invalid access token' });
  }
};

export default verifyAccessToken;