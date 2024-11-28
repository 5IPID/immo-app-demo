import express, { Request, Response } from "express";
import { connectDB } from "./config/database";
import bodyParser from "body-parser";
import newsletterForm from "./routes/newsletterForm";
import users from "./routes/user.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sign, verify } from 'jsonwebtoken';
import verifyAccessToken from "./utils/token";
import { v4 as uuidv4 } from 'uuid';
//import dotenv from 'dotenv';

//dotenv.config();

// Utilisation des clés secrètes depuis les variables d'environnement
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'defaultAccessSecret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'defaultRefreshSecret';

interface SessionPayload {
  sessionId: string;
}

// Fonction pour générer les tokens
const generateTokens = () => {
  const sessionId = uuidv4();
  
  const accessToken = sign({ sessionId }, accessTokenSecret, { expiresIn: '1h' });
  const refreshToken = sign({ sessionId }, refreshTokenSecret, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connectDB();

// Initialisation des tokens
app.post('/init', (req, res) => {  
  const { accessToken, refreshToken } = generateTokens();
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'none',
  });
  
  res.json({ accessToken });
});

// Route de renouvellement des tokens
app.post('/refresh-token', (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  
  if (!refreshToken) {
    return res.status(403).json({ error: 'No refresh token provided' });
  }
  
  try {
    const payload = verify(refreshToken, refreshTokenSecret);
    
    const newAccessToken = sign({ sessionId: (payload as any).sessionId }, accessTokenSecret, { expiresIn: '1h' });
    
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Error validating refresh token:', err);
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// Routes protégées
app.use("/newsletterForm", verifyAccessToken, newsletterForm);
app.use("/users", verifyAccessToken, users);

// Route publique
app.get("/", (_req, res) => {
  res.send("API Running");
});

// Configuration du serveur
app.set("port", process.env.PORT || 5050);
const port = app.get("port");
export const server = app.listen(port, () => console.log(`Server started on port ${port}`));