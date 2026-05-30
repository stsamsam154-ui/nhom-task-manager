import { useEffect, useMemo, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useTheme } from '../../ThemeContext';
import { useBoard } from '../../hooks/useBoard';
import { useDragDrop } from '../../hooks/useDragDrop';
import { COLUMNS, TASK_TAGS, getAvatarEmoji } from '../../config/seasonConfig';
import Column from './Column';
import TaskDetail from './TaskDetail';
import QuoteFooter from './QuoteFooter';
import AvatarPicker from '../AvatarPicker';
import appIcon from '../../assets/app-icon.png';

const FILTERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'today', label: 'Hôm nay' },
  { id: 'important', label: 'Quan trọng' },
  { id: 'upcoming', label: 'Sắp hết hạn' },
  { id: 'overdue', label: 'Quá hạn' },
];

const PROFILE_THEMES = [
  { id: 'blue', label: 'Xanh', light: '#f1f5f9', dark: '#0f172a', accent: '#1877f2', soft: '#e0f2fe' },
  { id: 'green', label: 'Xanh lá', light: '#eef7f1', dark: '#102019', accent: '#16a34a', soft: '#dcfce7' },
  { id: 'rose', label: 'Hồng nhẹ', light: '#f8f1f5', dark: '#21121a', accent: '#db2777', soft: '#fce7f3' },
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
  if (state === 'overdue') return 'Quá hạn';
  if (state === 'today') return 'Đến hạn hôm nay';
  if (state === 'upcoming') return 'Sắp hết hạn';
  return 'Còn thời gian';
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
  const [profileThemeId, setProfileThemeId] = useState(() => localStorage.getItem('profile_theme') || 'blue');
  const [form, setForm] = useState({ title: '', description: '', deadline: '', status: 'todo', tag: '' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [userAvatar, setUserAvatar] = useState(user.avatar || 'cat');
  const isDragging = Boolean(activeTask);
  const profileTheme = PROFILE_THEMES.find(theme => theme.id === profileThemeId) || PROFILE_THEMES[0];
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
  const dashboardStats = useMemo(() => {
    const todayCount = tasks.filter(task => getDeadlineState(task.deadline) === 'today').length;
    const overdueCount = tasks.filter(task => getDeadlineState(task.deadline) === 'overdue').length;
    const doneCount = tasks.filter(task => task.status === 'done').length;
    const importantCount = tasks.filter(task => task.isImportant).length;
    return [
      { label: 'Tổng việc', value: tasks.length, color: '#1877f2' },
      { label: 'Hoàn thành', value: doneCount, color: '#16a34a' },
      { label: 'Quan trọng', value: importantCount, color: '#d97706' },
      { label: 'Hôm nay', value: todayCount, color: '#7c3aed' },
      { label: 'Quá hạn', value: overdueCount, color: '#dc2626' },
    ];
  }, [tasks]);
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

  useEffect(() => {
    localStorage.setItem('profile_theme', profileThemeId);
  }, [profileThemeId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createTask(form, user.id);
    setForm({ title: '', description: '', deadline: '', status: 'todo', tag: '' });
    setShowForm(false);
  };

  const logout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất không?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const bgGradient = isDark
    ? `radial-gradient(circle at top left, ${profileTheme.accent}22, transparent 32%), linear-gradient(135deg, ${profileTheme.dark}, #111827 56%, #0b1120)`
    : `radial-gradient(circle at top left, ${profileTheme.soft}, transparent 34%), linear-gradient(135deg, ${profileTheme.light}, #f8fafc 48%, #e8eef7)`;
  const firstName = user.fullName?.trim().split(' ').pop() || 'bạn';
  const hour = now.getHours();
  const greeting = hour < 11 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  return (
    <div style={{ minHeight: '100vh', background: bgGradient, transition: 'background-color 220ms ease' }}>

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 80, background: isDark ? 'rgba(17,24,39,0.92)' : 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', padding: '12px 24px', borderBottom: `1px solid ${isDark ? 'rgba(148,163,184,0.18)' : 'rgba(203,213,225,0.9)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.18)' : '0 8px 24px rgba(15,23,42,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={appIcon} alt="Task Board" style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 5px 14px rgba(15,23,42,0.18)' }} />
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
          <button onClick={() => setShowForm(true)} style={{ padding: '9px 16px', background: profileTheme.accent, color: 'white', border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: '800', fontSize: '13px', fontFamily: 'Nunito, sans-serif', boxShadow: `0 8px 20px ${profileTheme.accent}30` }}>
            + Thêm việc
          </button>
          <button onClick={logout} style={{ padding: '8px 12px', background: isDark ? '#1f2937' : '#f0f2f5', color: isDark ? '#fca5a5' : '#b91c1c', border: `1px solid ${isDark ? 'rgba(148,163,184,0.16)' : '#d8dde6'}`, borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: 'Nunito, sans-serif' }}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div style={{ padding: '18px 22px 24px' }}>
        {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} isDark={isDark} />}
        {showAvatarPicker && <AvatarPicker onClose={() => setShowAvatarPicker(false)} onSave={(av) => setUserAvatar(av)} />}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1.2fr) minmax(340px, 2fr)', gap: '12px', marginBottom: '10px' }}>
          <div style={{ padding: '16px', background: isDark ? 'rgba(17,24,39,0.92)' : 'rgba(255,255,255,0.92)', border: `1px solid ${isDark ? 'rgba(148,163,184,0.18)' : 'rgba(203,213,225,0.85)'}`, borderRadius: '16px', boxShadow: isDark ? '0 14px 32px rgba(0,0,0,0.18)' : '0 14px 32px rgba(15,23,42,0.08)' }}>
            <p style={{ margin: 0, fontSize: '12px', color: profileTheme.accent, fontWeight: '900' }}>Ngày của tôi</p>
            <h3 style={{ margin: '4px 0 6px', fontSize: '22px', color: isDark ? '#f8fafc' : '#1e293b' }}>{greeting}, {firstName}</h3>
            <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.5, color: isDark ? '#cbd5e1' : '#475569' }}>
              Hôm nay có {dashboardStats[3].value} công việc đến hạn và {dashboardStats[4].value} công việc quá hạn cần chú ý.
            </p>
          </div>

          <div style={{ padding: '14px', background: isDark ? 'rgba(17,24,39,0.92)' : 'rgba(255,255,255,0.92)', border: `1px solid ${isDark ? 'rgba(148,163,184,0.18)' : 'rgba(203,213,225,0.85)'}`, borderRadius: '16px', boxShadow: isDark ? '0 14px 32px rgba(0,0,0,0.18)' : '0 14px 32px rgba(15,23,42,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '900', color: isDark ? '#f8fafc' : '#1e293b' }}>Tổng quan nhanh</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                {PROFILE_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setProfileThemeId(theme.id)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '999px',
                      border: profileThemeId === theme.id ? `2px solid ${theme.accent}` : `1px solid ${isDark ? 'rgba(148,163,184,0.2)' : '#d8dde6'}`,
                      background: theme.accent,
                      cursor: 'pointer',
                    }}
                    title={`Chủ đề ${theme.label}`}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {dashboardStats.map(stat => (
                <div key={stat.label} style={{ padding: '11px', borderRadius: '12px', background: isDark ? 'rgba(31,41,55,0.9)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(148,163,184,0.14)' : '#e2e8f0'}`, boxShadow: isDark ? 'none' : '0 1px 2px rgba(15,23,42,0.04)' }}>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: stat.color }}>{stat.value}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: '800' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px', padding: '10px', background: isDark ? 'rgba(17,24,39,0.88)' : 'rgba(255,255,255,0.9)', border: `1px solid ${isDark ? 'rgba(148,163,184,0.16)' : 'rgba(203,213,225,0.85)'}`, borderRadius: '16px', boxShadow: isDark ? '0 10px 24px rgba(0,0,0,0.12)' : '0 10px 24px rgba(15,23,42,0.06)' }}>
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
                  background: isActive ? profileTheme.accent : (isDark ? '#1f2937' : '#f0f2f5'),
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
            marginBottom: '12px',
            padding: '11px 12px',
            borderRadius: '16px',
            background: isDark ? 'rgba(17,24,39,0.9)' : 'rgba(255,255,255,0.92)',
            border: `1px solid ${isDark ? 'rgba(148,163,184,0.16)' : 'rgba(203,213,225,0.85)'}`,
            boxShadow: isDark ? '0 10px 24px rgba(0,0,0,0.12)' : '0 10px 24px rgba(15,23,42,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '900', color: isDark ? '#f8fafc' : '#1e293b' }}>Thông báo deadline</p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b' }}>
                  {alertCounts.overdue} quá hạn · {alertCounts.today} đến hạn hôm nay · {alertCounts.upcoming} sắp hết hạn
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
              <h3 style={{ marginBottom: '1.5rem', fontSize: '18px', fontWeight: '800', color: isDark ? '#f1f5f9' : '#1e293b' }}>✨ Thêm công việc mới</h3>
              <form onSubmit={handleCreate}>
                {[
                  { label: 'Tiêu đề', key: 'title', type: 'text', required: true },
                  { label: 'Mô tả', key: 'description', type: 'text', required: false },
                  { label: 'Hạn chót', key: 'deadline', type: 'date', required: false },
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
                <label style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#94a3b8' : '#475569', display: 'block', marginBottom: '6px' }}>Nhãn màu</label>
                <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} style={{ width: '100%', padding: '10px 14px', marginBottom: '12px', borderRadius: '10px', border: `1.5px solid ${isDark ? '#334155' : '#e2e8f0'}`, fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: isDark ? 'rgba(15,23,42,0.5)' : 'white', color: isDark ? '#f1f5f9' : '#1e293b', fontFamily: 'Nunito, sans-serif' }}>
                  <option value="">Không chọn</option>
                  {TASK_TAGS.map(tag => <option key={tag.id} value={tag.id}>{tag.label}</option>)}
                </select>
                <label style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#94a3b8' : '#475569', display: 'block', marginBottom: '6px' }}>Cột</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: '10px 14px', marginBottom: '20px', borderRadius: '10px', border: `1.5px solid ${isDark ? '#334155' : '#e2e8f0'}`, fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: isDark ? 'rgba(15,23,42,0.5)' : 'white', color: isDark ? '#f1f5f9' : '#1e293b', fontFamily: 'Nunito, sans-serif' }}>
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontFamily: 'Nunito, sans-serif' }}>Lưu</button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '11px', background: isDark ? 'rgba(51,65,85,0.6)' : '#f1f5f9', color: isDark ? '#f1f5f9' : '#64748b', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontFamily: 'Nunito, sans-serif' }}>Hủy</button>
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
