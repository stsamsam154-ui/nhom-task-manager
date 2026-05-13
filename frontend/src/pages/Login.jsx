import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isRegister && form.password !== form.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }
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

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' };
  const eyeBtn = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '360px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {isRegister ? '📝 Đăng ký' : '👋 Đăng nhập'}
        </h2>
        {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '13px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '10px' }}>
              <input placeholder="Họ và tên" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} style={inputStyle} required />
            </div>
          )}
          <div style={{ marginBottom: '10px' }}>
            <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} required />
          </div>
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input placeholder="Mật khẩu" type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ ...inputStyle, paddingRight: '40px' }} required />
            <button type="button" style={eyeBtn} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {isRegister && (
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input placeholder="Nhập lại mật khẩu" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} style={{ ...inputStyle, paddingRight: '40px' }} required />
              <button type="button" style={eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
          )}
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>
            {isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '14px' }}>
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
          <span onClick={() => { setIsRegister(!isRegister); setError(''); }} style={{ color: '#4f46e5', cursor: 'pointer', marginLeft: '4px' }}>
            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
          </span>
        </p>
      </div>
    </div>
  );
}