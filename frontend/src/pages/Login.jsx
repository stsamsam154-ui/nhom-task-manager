import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await authService.register(form);
        alert('Đăng ký thành công! Hãy đăng nhập.');
        setIsRegister(false);
      } else {
        const res = await authService.login(form);
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/board');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '360px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {isRegister ? 'Đăng ký' : 'Đăng nhập'}
        </h2>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              placeholder="Họ và tên"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          )}
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <input
            placeholder="Mật khẩu"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            {isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '14px' }}>
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
          <span onClick={() => setIsRegister(!isRegister)} style={{ color: '#4f46e5', cursor: 'pointer', marginLeft: '4px' }}>
            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
          </span>
        </p>
      </div>
    </div>
  );
}