import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';

const COLUMNS = [
  { id: 'todo', label: 'Todo' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', deadline: '', assigneeId: '' });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await taskService.getAll();
      setTasks(res.data);
    } catch {
      navigate('/');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await taskService.create({ ...form, assigneeId: user.id });
      setForm({ title: '', description: '', deadline: '', assigneeId: '' });
      setShowForm(false);
      loadTasks();
    } catch (err) {
      alert('Lỗi tạo task!');
    }
  };

  const handleStatusChange = async (id, status) => {
    await taskService.updateStatus(id, status);
    loadTasks();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xoá task này?')) {
      await taskService.delete(id);
      loadTasks();
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isNearDeadline = (deadline) => {
    if (!deadline) return false;
    const diff = (new Date(deadline) - new Date()) / 86400000;
    return diff >= 0 && diff <= 2;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'white', padding: '12px 20px', borderRadius: '10px' }}>
        <h2 style={{ margin: 0 }}>🗂️ Task Board</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px' }}>Xin chào, <b>{user.fullName}</b></span>
          <button onClick={() => setShowForm(true)} style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ Thêm task</button>
          <button onClick={logout} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Đăng xuất</button>
        </div>
      </div>

      {/* Form thêm task */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Thêm task mới</h3>
            <form onSubmit={handleCreate}>
              <input placeholder="Tiêu đề" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Mô tả" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Lưu</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', background: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Huỷ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {COLUMNS.map(col => (
          <div key={col.id} style={{ background: 'white', borderRadius: '10px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: '500', fontSize: '14px' }}>{col.label}</span>
              <span style={{ background: '#f3f4f6', borderRadius: '99px', padding: '2px 8px', fontSize: '12px' }}>
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px' }}>
                  <p style={{ fontWeight: '500', fontSize: '13px', marginBottom: '6px' }}>{task.title}</p>
                  {task.description && <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>{task.description}</p>}
                  {task.deadline && (
                    <p style={{ fontSize: '11px', color: isNearDeadline(task.deadline) ? '#ef4444' : '#9ca3af', marginBottom: '6px' }}>
                      📅 {new Date(task.deadline).toLocaleDateString('vi-VN')}
                      {isNearDeadline(task.deadline) && ' ⚠️'}
                    </p>
                  )}
                  <select value={task.status} onChange={e => handleStatusChange(task.id, e.target.value)} style={{ width: '100%', padding: '4px', fontSize: '12px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '6px' }}>
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  <button onClick={() => handleDelete(task.id)} style={{ width: '100%', padding: '4px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Xoá</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}