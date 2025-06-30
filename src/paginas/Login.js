import React, { useState } from 'react';
import Api from '../servico/Api';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !senha) {
      setError('Preencha email e senha.');
      return;
    }

    try {
      const response = await Api.Api.post('/api/auth/login', { email, senha });

      const { token, idUsuario, isAdmin, nomeUsuario } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('idUsuario', idUsuario);
      localStorage.setItem('isAdmin', isAdmin);
      localStorage.setItem('nomeUsuario', nomeUsuario);
      

      if (onLoginSuccess) onLoginSuccess({ token, isAdmin, nomeUsuario });
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao fazer login.';
      setError(msg);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
  <div
    className="p-5 bg-white shadow rounded"
    style={{ maxWidth: '500px', width: '100%' }}
  >
    <div className="text-center mb-4">
      <h1 className="fw-bold" style={{ fontSize: '2rem' }}>Loja Virtual</h1>
      <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
        Faça login para acessar sua conta
      </p>
    </div>

    {error && (
      <div className="alert alert-danger text-center">{error}</div>
    )}

    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="email" className="form-label fs-6">E-mail</label>
        <input
          type="email"
          id="email"
          className="form-control form-control-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="senha" className="form-label fs-6">Senha</label>
        <input
          type="password"
          id="senha"
          className="form-control form-control-lg"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
          required
        />
      </div>

      <button
        type="submit"
        className="btn w-100 py-2 fw-bold text-white"
        style={{ backgroundColor: '#ff6600', fontSize: '1.1rem' }}
      >
        Entrar
      </button>
    </form>

    <div className="text-center mt-4">
      <a href="/recuperar-senha" className="text-decoration-none" style={{ color: '#ff6600' }}>
        Esqueceu sua senha?
      </a>
      <br />
      <span className="text-muted">Não tem conta?</span>
      <a href="/cadastro" className="ms-1 text-decoration-none" style={{ color: '#ff6600' }}>
        Cadastre-se
      </a>
    </div>
  </div>
</div>

  );
}
