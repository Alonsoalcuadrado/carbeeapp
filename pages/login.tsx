import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser, LoginRequestBody } from '../api/apiClient';
import "../styles/login.css";

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
        // Save token in session storage
        sessionStorage.setItem('token', response.token);
        // Redirect user to dashboard
        router.push('/dashboard');
      } else {
        setError('Error en inicio de sesión');
      }
    } catch (err) {
      setError('Error en inicio de sesión');
    }
  };

  return (
    <div className="login-container">
    <div className="login-box">
      <h2 className="login-title">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>Usuario</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <p className="login-error">{error}</p>}
        <div className="login-actions">
          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  </div>
  );
}

export default LoginPage;
