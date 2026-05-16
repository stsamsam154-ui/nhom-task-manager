import { useState } from 'react';
import { userService } from '../services/api';

const AVATARS = [
  { id: 'cat', emoji: '🐱', name: 'Mèo' },
  { id: 'dog', emoji: '🐶', name: 'Chó' },
  { id: 'fox', emoji: '🦊', name: 'Cáo' },
  { id: 'panda', emoji: '🐼', name: 'Gấu trúc' },
  { id: 'rabbit', emoji: '🐰', name: 'Thỏ' },
  { id: 'bear', emoji: '🐻', name: 'Gấu' },
  { id: 'tiger', emoji: '🐯', name: 'Hổ' },
  { id: 'koala', emoji: '🐨', name: 'Koala' },
  { id: 'frog', emoji: '🐸', name: 'Ếch' },
  { id: 'penguin', emoji: '🐧', name: 'Chim cánh cụt' },
  { id: 'lion', emoji: '🦁', name: 'Sư tử' },
  { id: 'cow', emoji: '🐮', name: 'Bò' },
  { id: 'pig', emoji: '🐷', name: 'Lợn' },
  { id: 'octopus', emoji: '🐙', name: 'Bạch tuộc' },
  { id: 'unicorn', emoji: '🦄', name: 'Kỳ lân' },
  { id: 'dragon', emoji: '🐲', name: 'Rồng' },
  { id: 'monkey', emoji: '🐵', name: 'Khỉ' },
  { id: 'chicken', emoji: '🐔', name: 'Gà' },
  { id: 'duck', emoji: '🦆', name: 'Vịt' },
  { id: 'owl', emoji: '🦉', name: 'Cú' },
  { id: 'squirrel', emoji: '🐿️', name: 'Sóc' },
  { id: 'hamster', emoji: '🐹', name: 'Chuột hamster' },
  { id: 'wolf', emoji: '🐺', name: 'Sói' },
  { id: 'elephant', emoji: '🐘', name: 'Voi' },
];

export default function AvatarPicker({ onClose, onSave }) {
  const [selected, setSelected] = useState('cat');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const getEmoji = (id) => AVATARS.find(a => a.id === id)?.emoji || '🐱';

  const handleSave = async () => {
    await userService.updateAvatar(user.id, selected);
    const updatedUser = { ...user, avatar: selected };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    onSave(selected);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div style={{ background: 'white', borderRadius: '24px', width: '500px', maxHeight: '85vh', overflow: 'auto', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Chon Avatar</h3>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px' }}>x</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', gap: '16px' }}>
          <div style={{ fontSize: '64px', lineHeight: 1 }}>{getEmoji(selected)}</div>
          <div>
            <p style={{ fontWeight: '800', fontSize: '18px', marginBottom: '4px' }}>{AVATARS.find(a => a.id === selected)?.name}</p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Avatar da chon</p>
          </div>
        </div>

        <p style={{ fontWeight: '700', fontSize: '13px', marginBottom: '12px', color: '#475569' }}>Chon con vat cua ban:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '1.5rem' }}>
          {AVATARS.map(avatar => (
            <div key={avatar.id} onClick={() => setSelected(avatar.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 6px', borderRadius: '12px', cursor: 'pointer', background: selected === avatar.id ? '#eef2ff' : '#f8fafc', border: `2px solid ${selected === avatar.id ? '#6366f1' : 'transparent'}`, transition: 'all 0.15s' }}>
              <span style={{ fontSize: '28px', lineHeight: 1, marginBottom: '4px' }}>{avatar.emoji}</span>
              <span style={{ fontSize: '9px', color: '#64748b', textAlign: 'center' }}>{avatar.name}</span>
            </div>
          ))}
        </div>

        <button onClick={handleSave} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '15px', fontFamily: 'Nunito, sans-serif' }}>
          Luu Avatar
        </button>
      </div>
    </div>
  );
}