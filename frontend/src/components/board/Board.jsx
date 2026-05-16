import { useMemo, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useTheme } from '../../ThemeContext';
import { useBoard } from '../../hooks/useBoard';
import { useDragDrop } from '../../hooks/useDragDrop';
import { COLUMNS, getAvatarEmoji } from '../../config/seasonConfig';
import Column from './Column';
import TaskDetail from './TaskDetail';
import QuoteFooter from './QuoteFooter';
import AvatarPicker from '../AvatarPicker';

export default function Board() {
  const { isDark, toggle } = useTheme();
  const { tasks, createTask, updateStatus, deleteTask, toggleImportant, isNearDeadline } = useBoard();
  const { sensors, activeTask, handleDragStart, handleDragEnd } = useDragDrop(tasks, updateStatus);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [dropEffect, setDropEffect] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', deadline: '', status: 'todo' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [userAvatar, setUserAvatar] = useState(user.avatar || 'cat');
  const isDragging = Boolean(activeTask);
  const tasksByStatus = useMemo(() => {
    return COLUMNS.reduce((grouped, col) => {
      grouped[col.id] = tasks.filter(t => t.status === col.id);
      return grouped;
    }, {});
  }, [tasks]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createTask(form, user.id);
    setForm({ title: '', description: '', deadline: '', status: 'todo' });
    setShowForm(false);
  };

  const handleDragEndWithParticle = async (event) => {
    const { over } = event;
    const didMove = await handleDragEnd(event);
    if (didMove && over) setDropEffect({ id: over.id, key: Date.now() });
    setTimeout(() => setDropEffect(null), 2600);
  };

  const logout = () => {
    if (window.confirm('Ban co chac muon dang xuat khong?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const bgGradient = isDark
    ? 'linear-gradient(135deg, #0f172a 0%, #1a1625 50%, #0f1923 100%)'
    : 'linear-gradient(135deg, #F4F8F3 0%, #F3EEFF 50%, #EDF7FF 100%)';

  return (
    <div style={{ minHeight: '100vh', background: bgGradient, transition: 'all 400ms ease-in-out' }}>

      {/* Header */}
      <div style={{ background: isDark ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', padding: '14px 24px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🗂️</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: isDark ? '#f1f5f9' : '#1e293b' }}>Task Board</h2>
            <p style={{ margin: 0, fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', fontStyle: 'italic' }}>Every task has its season</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div onClick={() => setShowAvatarPicker(true)} style={{ background: isDark ? 'rgba(51,65,85,0.6)' : 'rgba(241,245,249,0.8)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '99px', fontSize: '13px', color: isDark ? '#f1f5f9' : '#475569', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}` }}>
            <span style={{ fontSize: '22px' }}>{getAvatarEmoji(userAvatar)}</span>
            {user.fullName}
          </div>
          <button onClick={toggle} style={{ padding: '8px 12px', background: isDark ? 'rgba(51,65,85,0.6)' : 'rgba(241,245,249,0.8)', backdropFilter: 'blur(8px)', color: isDark ? '#fbbf24' : '#64748b', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}`, borderRadius: '10px', cursor: 'pointer', fontSize: '18px' }}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setShowForm(true)} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 15px rgba(102,126,234,0.4)' }}>
            + Them task
          </button>
          <button onClick={logout} style={{ padding: '8px 14px', background: 'rgba(254,226,226,0.8)', backdropFilter: 'blur(8px)', color: '#ef4444', border: '1px solid rgba(254,202,202,0.5)', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: 'Nunito, sans-serif' }}>
            Dang xuat
          </button>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} isDark={isDark} />}
        {showAvatarPicker && <AvatarPicker onClose={() => setShowAvatarPicker(false)} onSave={(av) => setUserAvatar(av)} />}

        {/* Form thêm task */}
        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', padding: '2rem', borderRadius: '20px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}` }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '18px', fontWeight: '800', color: isDark ? '#f1f5f9' : '#1e293b' }}>✨ Them task moi</h3>
              <form onSubmit={handleCreate}>
                {[
                  { label: 'Tieu de', key: 'title', type: 'text', required: true },
                  { label: 'Mo ta', key: 'description', type: 'text', required: false },
                  { label: 'Deadline', key: 'deadline', type: 'date', required: false },
                ].map(({ label, key, type, required }) => (
                  <div key={key}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#94a3b8' : '#475569', display: 'block', marginBottom: '6px' }}>{label}</label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      required={required}
                      style={{ width: '100%', padding: '10px 14px', marginBottom: '12px', borderRadius: '10px', border: `1.5px solid ${isDark ? '#334155' : '#e2e8f0'}`, fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: isDark ? 'rgba(15,23,42,0.5)' : 'white', color: isDark ? '#f1f5f9' : '#1e293b', fontFamily: 'Nunito, sans-serif' }}
                    />
                  </div>
                ))}
                <label style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#94a3b8' : '#475569', display: 'block', marginBottom: '6px' }}>Cot</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: '10px 14px', marginBottom: '20px', borderRadius: '10px', border: `1.5px solid ${isDark ? '#334155' : '#e2e8f0'}`, fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: isDark ? 'rgba(15,23,42,0.5)' : 'white', color: isDark ? '#f1f5f9' : '#1e293b', fontFamily: 'Nunito, sans-serif' }}>
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontFamily: 'Nunito, sans-serif' }}>Luu</button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '11px', background: isDark ? 'rgba(51,65,85,0.6)' : '#f1f5f9', color: isDark ? '#f1f5f9' : '#64748b', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontFamily: 'Nunito, sans-serif' }}>Huy</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEndWithParticle}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {COLUMNS.map(col => (
              <Column
                key={col.id}
                col={col}
                tasks={tasksByStatus[col.id]}
                isNearDeadline={isNearDeadline}
                onDelete={deleteTask}
                onStatusChange={updateStatus}
                onSelect={setSelectedTask}
                onToggleImportant={toggleImportant}
                isDark={isDark}
                isDropTarget={dropEffect?.id === col.id}
                dropEffectKey={dropEffect?.key}
                isDragging={isDragging}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && (
              <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', border: '2px solid #6366f1', borderRadius: '20px', padding: '12px', boxShadow: '0 10px 30px rgba(99,102,241,0.3)', transform: 'scale(1.04)' }}>
                <p style={{ fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>{activeTask.title}</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>

        <QuoteFooter isDark={isDark} />
      </div>
    </div>
  );
}
