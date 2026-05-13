import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService, commentService } from '../services/api';
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';

const COLUMNS = [
  { id: 'todo', label: '📋 Todo', color: '#6366f1', bg: '#eef2ff' },
  { id: 'inprogress', label: '⚡ In Progress', color: '#f59e0b', bg: '#fffbeb' },
  { id: 'review', label: '🔍 Review', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'done', label: '✅ Done', color: '#10b981', bg: '#ecfdf5' },
];

function TaskDetail({ task, onClose }) {
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '520px', maxHeight: '85vh', overflow: 'auto', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{task.title}</h3>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>x</button>
        </div>
        {task.description && (
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '1rem', background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>{task.description}</p>
        )}
        {task.deadline && (
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '1rem' }}>
            Deadline: <b>{new Date(task.deadline).toLocaleDateString('vi-VN')}</b>
          </p>
        )}
        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', marginBottom: '1rem' }} />
        <h4 style={{ marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>Comments ({comments.length})</h4>
        <div style={{ marginBottom: '1rem', maxHeight: '250px', overflowY: 'auto' }}>
          {comments.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px' }}>Chua co comment nao!</p>
          )}
          {comments.map(c => (
            <div key={c.id} style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px 14px', marginBottom: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1' }}>{c.author?.fullName || 'An danh'}</span>
                <button onClick={() => handleDeleteComment(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}>Xoa</button>
              </div>
              <p style={{ fontSize: '13px', margin: 0, color: '#334155' }}>{c.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleComment} style={{ display: 'flex', gap: '8px' }}>
          <input value={content} onChange={e => setContent(e.target.value)} placeholder="Viet comment..." style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none' }} />
          <button type="submit" style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Gui</button>
        </form>
      </div>
    </div>
  );
}

function TaskCard({ task, isNearDeadline, onDelete, onStatusChange, onSelect, onToggleImportant }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}
      style={{ background: task.isImportant ? '#fffbeb' : 'white', border: `1px solid ${task.isImportant ? '#fde68a' : '#f1f5f9'}`, borderRadius: '12px', padding: '12px', marginBottom: '8px', cursor: 'grab', opacity: isDragging ? 0.3 : 1, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <p style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b', margin: 0, flex: 1 }}>{task.title}</p>
        <span style={{ fontSize: '16px', marginLeft: '6px' }}>{task.isImportant ? '⭐' : ''}</span>
      </div>
      {task.description && <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', lineHeight: '1.4' }}>{task.description}</p>}
      {task.deadline && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: isNearDeadline(task.deadline) ? '#fee2e2' : '#f1f5f9', color: isNearDeadline(task.deadline) ? '#ef4444' : '#64748b', padding: '3px 8px', borderRadius: '99px', fontSize: '11px', marginBottom: '8px', fontWeight: '500' }}>
          {new Date(task.deadline).toLocaleDateString('vi-VN')}
          {isNearDeadline(task.deadline) && ' !'}
        </div>
      )}
      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }} onPointerDown={e => e.stopPropagation()}>
        <button onClick={() => onToggleImportant(task.id)} style={{ padding: '5px 8px', background: task.isImportant ? '#fef9c3' : '#f1f5f9', color: task.isImportant ? '#f59e0b' : '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
          {task.isImportant ? 'Quan trong' : 'Danh dau'}
        </button>
        <button onClick={() => onSelect(task)} style={{ flex: 1, padding: '5px', background: '#eef2ff', color: '#6366f1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>Comment</button>
        <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value)}
          style={{ flex: 1, padding: '5px', fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#475569' }}>
          {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <button onClick={() => onDelete(task.id)}
          style={{ padding: '5px 8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px' }}>Xoa</button>
      </div>
    </div>
  );
}

function Column({ col, tasks, isNearDeadline, onDelete, onStatusChange, onSelect, onToggleImportant }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  return (
    <div ref={setNodeRef} style={{ background: isOver ? col.bg : '#f8fafc', borderRadius: '16px', padding: '14px', minHeight: '300px', transition: 'background 0.2s', border: `2px solid ${isOver ? col.color : 'transparent'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontWeight: '700', fontSize: '13px', color: col.color }}>{col.label}</span>
        <span style={{ background: col.bg, color: col.color, borderRadius: '99px', padding: '2px 10px', fontSize: '12px', fontWeight: '600' }}>{tasks.length}</span>
      </div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} isNearDeadline={isNearDeadline} onDelete={onDelete} onStatusChange={onStatusChange} onSelect={onSelect} onToggleImportant={onToggleImportant} />
      ))}
    </div>
  );
}

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', deadline: '', status: 'todo' });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const res = await taskService.getAll();
      setTasks(res.data);
    } catch { navigate('/'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await taskService.create({ ...form, assigneeId: user.id });
      setForm({ title: '', description: '', deadline: '', status: 'todo' });
      setShowForm(false);
      loadTasks();
    } catch { alert('Loi tao task!'); }
  };

  const handleStatusChange = async (id, status) => {
    await taskService.updateStatus(id, status);
    loadTasks();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xoa task nay?')) {
      await taskService.delete(id);
      loadTasks();
    }
  };

  const handleToggleImportant = async (id) => {
    await taskService.toggleImportant(id);
    loadTasks();
  };

  const handleDragStart = (event) => {
    setActiveTask(tasks.find(t => t.id === event.active.id));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const draggedTask = tasks.find(t => t.id === active.id);
    if (!draggedTask) return;
    const newStatus = over.id;
    if (COLUMNS.find(c => c.id === newStatus) && draggedTask.status !== newStatus) {
      await taskService.updateStatus(draggedTask.id, newStatus);
      loadTasks();
    }
  };

  const isNearDeadline = (deadline) => {
    if (!deadline) return false;
    const diff = (new Date(deadline) - new Date()) / 86400000;
    return diff >= 0 && diff <= 2;
  };

  const logout = () => { localStorage.clear(); navigate('/'); };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <div style={{ background: 'white', padding: '14px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🗂️</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Task Board</h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Quan ly cong viec nhom</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#f1f5f9', padding: '6px 14px', borderRadius: '99px', fontSize: '13px', color: '#475569', fontWeight: '500' }}>
            {user.fullName}
          </div>
          <button onClick={() => setShowForm(true)} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            + Them task
          </button>
          <button onClick={logout} style={{ padding: '8px 14px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            Dang xuat
          </button>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />}

        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '18px', fontWeight: '700' }}>Them task moi</h3>
              <form onSubmit={handleCreate}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>Tieu de</label>
                <input placeholder="Nhap tieu de task..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ width: '100%', padding: '10px 14px', marginBottom: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>Mo ta</label>
                <input placeholder="Mo ta task..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', padding: '10px 14px', marginBottom: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} style={{ width: '100%', padding: '10px 14px', marginBottom: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>Cot</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: '10px 14px', marginBottom: '20px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}>
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Luu</button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '11px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Huy</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {COLUMNS.map(col => (
              <Column key={col.id} col={col} tasks={tasks.filter(t => t.status === col.id)}
                isNearDeadline={isNearDeadline} onDelete={handleDelete} onStatusChange={handleStatusChange} onSelect={setSelectedTask} onToggleImportant={handleToggleImportant} />
            ))}
          </div>
          <DragOverlay>
            {activeTask && (
              <div style={{ background: 'white', border: '2px solid #6366f1', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(99,102,241,0.3)' }}>
                <p style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b' }}>{activeTask.title}</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}