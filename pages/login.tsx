import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser, LoginRequestBody } from '../api/apiClient'; // Asegúrate de importar desde la ubicación correcta.

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const credentials: LoginRequestBody = { username, password };
      const response = await loginUser(credentials);
      if (response.token) {
        // Guarda el token en localStorage
        sessionStorage.setItem('token', response.token);
        // Redirige al usuario al dashboard
        router.push('/dashboard');
      } else {
        setError('Error en inicio de sesión');
      }
    } catch (err) {
      setError('Error en inicio de sesión');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <div>
          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
