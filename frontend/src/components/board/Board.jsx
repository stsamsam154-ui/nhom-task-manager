import { useEffect, useMemo, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useTheme } from '../../ThemeContext';
import { useBoard } from '../../hooks/useBoard';
import { useDragDrop } from '../../hooks/useDragDrop';
import { COLUMNS, getAvatarEmoji } from '../../config/seasonConfig';
import Column from './Column';
import TaskDetail from './TaskDetail';
import QuoteFooter from './QuoteFooter';
import AvatarPicker from '../AvatarPicker';

const FILTERS = [
  { id: 'all', label: 'Tat ca' },
  { id: 'today', label: 'Hom nay' },
  { id: 'important', label: 'Quan trong' },
  { id: 'upcoming', label: 'Sap het han' },
  { id: 'overdue', label: 'Qua han' },
];

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const getDeadlineState = (deadline) => {
  if (!deadline) return 'none';
  const today = startOfDay(new Date());
  const due = startOfDay(deadline);
  const diffDays = Math.round((due - today) / 86400000);

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 2) return 'upcoming';
  return 'normal';
};

const getDeadlineLabel = (deadline) => {
  const state = getDeadlineState(deadline);
  if (state === 'overdue') return 'Qua han';
  if (state === 'today') return 'Den han hom nay';
  if (state === 'upcoming') return 'Sap het han';
  return 'Con thoi gian';
};

export default function Board() {
  const { isDark, toggle } = useTheme();
  const { tasks, createTask, updateStatus, deleteTask, toggleImportant, isNearDeadline } = useBoard();
  const { sensors, activeTask, handleDragStart, handleDragEnd } = useDragDrop(tasks, updateStatus);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [now, setNow] = useState(new Date());
  const [form, setForm] = useState({ title: '', description: '', deadline: '', status: 'todo' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [userAvatar, setUserAvatar] = useState(user.avatar || 'cat');
  const isDragging = Boolean(activeTask);
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const deadlineState = getDeadlineState(task.deadline);
      if (activeFilter === 'today') return deadlineState === 'today';
      if (activeFilter === 'important') return task.isImportant;
      if (activeFilter === 'upcoming') return deadlineState === 'upcoming';
      if (activeFilter === 'overdue') return deadlineState === 'overdue';
      return true;
    });
  }, [activeFilter, tasks]);
  const filterCounts = useMemo(() => {
    return FILTERS.reduce((counts, filter) => {
      counts[filter.id] = tasks.filter((task) => {
        const deadlineState = getDeadlineState(task.deadline);
        if (filter.id === 'today') return deadlineState === 'today';
        if (filter.id === 'important') return task.isImportant;
        if (filter.id === 'upcoming') return deadlineState === 'upcoming';
        if (filter.id === 'overdue') return deadlineState === 'overdue';
        return true;
      }).length;
      return counts;
    }, {});
  }, [tasks]);
  const deadlineAlerts = useMemo(() => {
    return tasks
      .filter((task) => ['overdue', 'today', 'upcoming'].includes(getDeadlineState(task.deadline)))
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);
  }, [tasks]);
  const alertCounts = useMemo(() => {
    return deadlineAlerts.reduce((counts, task) => {
      const state = getDeadlineState(task.deadline);
      counts[state] = (counts[state] || 0) + 1;
      return counts;
    }, { overdue: 0, today: 0, upcoming: 0 });
  }, [deadlineAlerts]);
  const tasksByStatus = useMemo(() => {
    return COLUMNS.reduce((grouped, col) => {
      grouped[col.id] = filteredTasks.filter(t => t.status === col.id);
      return grouped;
    }, {});
  }, [filteredTasks]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createTask(form, user.id);
    setForm({ title: '', description: '', deadline: '', status: 'todo' });
    setShowForm(false);
  };

  const logout = () => {
    if (window.confirm('Ban co chac muon dang xuat khong?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const bgGradient = isDark
    ? '#0f172a'
    : '#f0f2f5';

  return (
    <div style={{ minHeight: '100vh', background: bgGradient, transition: 'background-color 220ms ease' }}>

      {/* Header */}
      <div style={{ background: isDark ? '#111827' : '#ffffff', padding: '12px 24px', borderBottom: `1px solid ${isDark ? 'rgba(148,163,184,0.16)' : '#d8dde6'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: isDark ? 'none' : '0 1px 2px rgba(15,23,42,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>🗂️</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: isDark ? '#f1f5f9' : '#1e293b' }}>Task Board</h2>
            <p style={{ margin: 0, fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', fontStyle: 'italic' }}>
              {now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })} · {now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div onClick={() => setShowAvatarPicker(true)} style={{ background: isDark ? '#1f2937' : '#f0f2f5', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', color: isDark ? '#f1f5f9' : '#475569', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', border: `1px solid ${isDark ? 'rgba(148,163,184,0.16)' : '#d8dde6'}` }}>
            <span style={{ fontSize: '22px' }}>{getAvatarEmoji(userAvatar)}</span>
            {user.fullName}
          </div>
          <button onClick={toggle} style={{ padding: '8px 10px', background: isDark ? '#1f2937' : '#f0f2f5', color: isDark ? '#fbbf24' : '#475569', border: `1px solid ${isDark ? 'rgba(148,163,184,0.16)' : '#d8dde6'}`, borderRadius: '10px', cursor: 'pointer', fontSize: '17px' }}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setShowForm(true)} style={{ padding: '9px 16px', background: '#1877f2', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', fontFamily: 'Nunito, sans-serif' }}>
            + Them task
          </button>
          <button onClick={logout} style={{ padding: '8px 12px', background: isDark ? '#1f2937' : '#f0f2f5', color: isDark ? '#fca5a5' : '#b91c1c', border: `1px solid ${isDark ? 'rgba(148,163,184,0.16)' : '#d8dde6'}`, borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: 'Nunito, sans-serif' }}>
            Dang xuat
          </button>
        </div>
      </div>

      <div style={{ padding: '14px 20px 20px' }}>
        {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} isDark={isDark} />}
        {showAvatarPicker && <AvatarPicker onClose={() => setShowAvatarPicker(false)} onSave={(av) => setUserAvatar(av)} />}

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px', padding: '9px 10px', background: isDark ? '#111827' : '#ffffff', border: `1px solid ${isDark ? 'rgba(148,163,184,0.16)' : '#d8dde6'}`, borderRadius: '12px', boxShadow: isDark ? 'none' : '0 1px 2px rgba(15,23,42,0.05)' }}>
          {FILTERS.map(filter => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '999px',
                  border: 'none',
                  background: isActive ? '#1877f2' : (isDark ? '#1f2937' : '#f0f2f5'),
                  color: isActive ? 'white' : (isDark ? '#e2e8f0' : '#334155'),
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '800',
                  fontFamily: 'Nunito, sans-serif',
                }}>
                {filter.label} <span style={{ opacity: 0.8 }}>({filterCounts[filter.id] || 0})</span>
              </button>
            );
          })}
        </div>

        {deadlineAlerts.length > 0 && (
          <div style={{
            marginBottom: '10px',
            padding: '11px 12px',
            borderRadius: '12px',
            background: isDark ? '#111827' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(148,163,184,0.16)' : '#d8dde6'}`,
            boxShadow: isDark ? 'none' : '0 1px 2px rgba(15,23,42,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '900', color: isDark ? '#f8fafc' : '#1e293b' }}>Thong bao deadline</p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b' }}>
                  {alertCounts.overdue} qua han · {alertCounts.today} den han hom nay · {alertCounts.upcoming} sap het han
                </p>
              </div>
              <button
                onClick={() => setActiveFilter(alertCounts.overdue ? 'overdue' : 'upcoming')}
                style={{
                  padding: '7px 10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: alertCounts.overdue ? '#ef4444' : '#f59e0b',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                }}>
                Xem ngay
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
              {deadlineAlerts.map((task) => {
                const state = getDeadlineState(task.deadline);
                const tone = state === 'overdue' ? '#ef4444' : state === 'today' ? '#f97316' : '#f59e0b';
                return (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    style={{
                      textAlign: 'left',
                      minWidth: '190px',
                      padding: '9px 10px',
                      borderRadius: '10px',
                      border: `1px solid ${isDark ? 'rgba(148,163,184,0.14)' : '#e2e8f0'}`,
                      background: isDark ? '#1f2937' : '#f8fafc',
                      cursor: 'pointer',
                      fontFamily: 'Nunito, sans-serif',
                    }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: isDark ? '#f8fafc' : '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '11px', fontWeight: '800', color: tone }}>
                      {getDeadlineLabel(task.deadline)} · {new Date(task.deadline).toLocaleDateString('vi-VN')}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
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
