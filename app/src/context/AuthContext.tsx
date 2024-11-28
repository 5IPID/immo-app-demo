// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { baseUrl } from '../config';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  initSession: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    console.log("AuthProvider component rendered"); // Ajoute un log pour vérifier que AuthProvider est monté

    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

  // Fonction pour initialiser la session et récupérer les tokens
  const initSession = async () => {
    try {
        console.log("Dans le initsession")
      const response = await fetch(`${baseUrl}/init`, { method: 'POST', credentials: 'include' });
      if (!response.ok) throw new Error('Erreur lors de l\'initialisation de la session');
      const data = await response.json();
      console.log('Session initialized:', data);  // Log de la réponse
      setAccessToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken); // Sauvegarder le token dans localStorage
      setRefreshToken(data.refreshToken);
      localStorage.setItem('refreshToken', data.refreshToken); // Sauvegarder le refresh token
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la session:', error);
    }
  };

  // Fonction pour rafraîchir le token d'accès
  const refreshAccessToken = async () => {
    if (!refreshToken) return;

    try {
      const response = await fetch(`${baseUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Échec du rafraîchissement du token');
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;
      localStorage.setItem('accessToken', newAccessToken); // Stocker le nouveau access token
      setAccessToken(newAccessToken); // Mettre à jour le state avec le nouveau token
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token d\'accès:', error);
    }
  };

  useEffect(() => {
    console.log('useEffect for initSession triggered'); // Ce log devrait être affiché
    // Vérification que les tokens sont invalides
    if (!accessToken || accessToken === 'undefined' || !refreshToken || refreshToken === 'undefined') {
      console.log('Tokens not found or invalid, calling initSession...');
      initSession(); // Initialiser la session si aucun token n'est présent ou si les tokens sont invalides
    }
  }, []); // Effect au montage du composant

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, setAccessToken, setRefreshToken, initSession, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};