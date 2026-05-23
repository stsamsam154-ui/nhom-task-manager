import { useState, useEffect } from 'react';
import { commentService } from '../../services/api';
import { getAvatarEmoji } from '../../config/seasonConfig';

export default function TaskDetail({ task, onClose, isDark }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { loadComments(); }, []);

  const loadComments = async () => {
    const res = await commentService.getByTask(task.id);
    setComments(res.data);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await commentService.create({ content, taskId: task.id, authorId: user.id });
    setContent('');
    loadComments();
  };

  const handleDeleteComment = async (id) => {
    await commentService.delete(id);
    loadComments();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{
        background: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        color: isDark ? '#f1f5f9' : '#1e293b',
        borderRadius: '20px',
        width: '520px',
        maxHeight: '85vh',
        overflow: 'auto',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{task.title}</h3>
          <button onClick={onClose} style={{ background: isDark ? '#334155' : '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', color: isDark ? '#f1f5f9' : '#1e293b' }}>x</button>
        </div>

        {task.description && (
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '14px', marginBottom: '1rem', background: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(248,250,252,0.8)', padding: '12px', borderRadius: '10px' }}>
            {task.description}
          </p>
        )}

        {task.deadline && (
          <p style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '1rem' }}>
            Hạn chót: <b>{new Date(task.deadline).toLocaleDateString('vi-VN')}</b>
          </p>
        )}

        <hr style={{ border: 'none', borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`, marginBottom: '1rem' }} />

        <h4 style={{ marginBottom: '12px', fontSize: '15px', fontWeight: '700' }}>
          Bình luận ({comments.length})
        </h4>

        <div style={{ marginBottom: '1rem', maxHeight: '250px', overflowY: 'auto' }}>
          {comments.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              Chưa có bình luận nào!
            </p>
          )}
          {comments.map(c => (
            <div key={c.id} style={{
              background: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(248,250,252,0.8)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '8px',
              border: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '20px' }}>{getAvatarEmoji(c.author?.avatar)}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1' }}>
                    {c.author?.fullName || 'Ẩn danh'}
                  </span>
                </div>
                <button onClick={() => handleDeleteComment(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}>Xóa</button>
              </div>
              <p style={{ fontSize: '13px', margin: 0, color: isDark ? '#cbd5e1' : '#334155', paddingLeft: '30px' }}>
                {c.content}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleComment} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '24px' }}>{getAvatarEmoji(user.avatar)}</span>
          <input
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Viết bình luận..."
            style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${isDark ? '#334155' : '#e2e8f0'}`, fontSize: '13px', outline: 'none', background: isDark ? 'rgba(15,23,42,0.5)' : 'white', color: isDark ? '#f1f5f9' : '#1e293b', fontFamily: 'Nunito, sans-serif' }}
          />
          <button type="submit" style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontFamily: 'Nunito, sans-serif' }}>
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
}
