import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import loginBlueBg from '../assets/login-blue-bg.jpg';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `linear-gradient(135deg, rgba(46, 120, 190, 0.28), rgba(201, 247, 250, 0.2)), url(${loginBlueBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      {init && <Particles
        id="tsparticles"
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            color: { value: '#ffffff' },
            links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.12, width: 1 },
            move: { enable: true, speed: 1 },
            number: { density: { enable: true, area: 900 }, value: 42 },
            opacity: { value: 0.22 },
            size: { value: { min: 1, max: 3 } },
          },
        }}
        style={{ position: 'absolute', inset: 0 }}
      />}

      <div style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', padding: '2.5rem', borderRadius: '24px', width: '400px', boxShadow: '0 24px 70px rgba(17, 71, 120, 0.24)', position: 'relative', zIndex: 10, border: '1px solid rgba(255,255,255,0.65)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🗂️</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b' }}>Task Board</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px', fontWeight: '500' }}>
            {isRegister ? 'Tạo tài khoản mới' : 'Đăng nhập để tiếp tục'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', marginBottom: '1rem', fontWeight: '600' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Họ và tên</label>
              <input placeholder="Nhập họ và tên..." value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Nunito, sans-serif' }} />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Email</label>
            <input placeholder="Nhập email..." type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
              style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Nunito, sans-serif' }} />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input placeholder="Nhập mật khẩu..." type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
                style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Nunito, sans-serif' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {isRegister && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Nhập lại mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <input placeholder="Nhập lại mật khẩu..." type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required
                  style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Nunito, sans-serif' }} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}

          <button type="submit" style={{ width: '100%', padding: '13px', marginTop: '8px', background: 'linear-gradient(135deg, #2f8ed8 0%, #5fc6d8 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '15px', boxShadow: '0 4px 15px rgba(47,142,216,0.35)', fontFamily: 'Nunito, sans-serif' }}>
            {isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
          {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <span onClick={() => { setIsRegister(!isRegister); setError(''); }} style={{ color: '#2f8ed8', cursor: 'pointer', fontWeight: '800' }}>
            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
          </span>
        </p>
      </div>
    </div>
  );
}
