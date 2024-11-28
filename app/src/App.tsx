import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { showNotification } from '@mantine/notifications';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import { OneColumnLayout } from "./layout/OneColumnLayout";
import Users from "./pages/Users";
import { useEffect, useState } from "react";
import { baseUrl } from "./config";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken') || null);

  const handleError = (message: string) => {
    showNotification({ title: 'Erreur', message, color: 'red' });
  };

  // Fonction pour rafraîchir le token d'accès
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      handleError('Refresh token absent');
      return;
    }

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
      localStorage.setItem('accessToken', newAccessToken); // Stocker le nouveau token
      setAccessToken(newAccessToken); // Mettre à jour l'état avec le nouveau token
      console.log('Access token refreshed successfully');
    } catch (error) {
      handleError('Impossible de rafraîchir le token d\'accès');
      console.error('Error refreshing access token:', error);
    }
  };

  // Initialisation de la session et récupération du token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/init`, { method: 'POST', credentials: 'include' });
        if (!response.ok) throw new Error('Erreur lors de l\'initialisation de la session');
        const data = await response.json();
        setAccessToken(data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken); // Sauvegarde le refreshToken dans localStorage
        setRefreshToken(data.refreshToken); // Met à jour l'état avec le refreshToken
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
      }
    };

    fetchData();
  }, []); // Le tableau vide [] garantit que l'appel est fait une seule fois au montage du composant

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OneColumnLayout />}>
          <Route path="/product" element={<Product />} />
          <Route path="/users" element={<Users accessToken={accessToken} refreshAccessToken={refreshAccessToken} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;