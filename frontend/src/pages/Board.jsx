import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService, commentService } from '../services/api';
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';

const COLUMNS = [
  { id: 'todo', label: 'Todo', color: '#6366f1' },
  { id: 'inprogress', label: 'In Progress', color: '#f59e0b' },
  { id: 'review', label: 'Review', color: '#8b5cf6' },
  { id: 'done', label: 'Done', color: '#10b981' },
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'white', borderRadius: '12px', width: '480px', maxHeight: '80vh', overflow: 'auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>{task.title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>x</button>
        </div>
        {task.description && <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '1rem' }}>{task.description}</p>}
        <hr style={{ marginBottom: '1rem' }} />
        <h4 style={{ marginBottom: '10px' }}>Comments ({comments.length})</h4>
        <div style={{ marginBottom: '1rem' }}>
          {comments.length === 0 && <p style={{ color: '#9ca3af', fontSize: '13px' }}>Chua co comment nao!</p>}
          {comments.map(c => (
            <div key={c.id} style={{ background: '#f9fafb', borderRadius: '8px', padding: '8px 12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#4f46e5' }}>{c.author?.fullName || 'An danh'}</span>
                <button onClick={() => handleDeleteComment(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>Xoa</button>
              </div>
              <p style={{ fontSize: '13px', margin: 0 }}>{c.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleComment} style={{ display: 'flex', gap: '8px' }}>
          <input value={content} onChange={e => setContent(e.target.value)} placeholder="Viet comment..." style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }} />
          <button type="submit" style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Gui</button>
        </form>
      </div>
    </div>
  );
}

function TaskCard({ task, isNearDeadline, onDelete, onStatusChange, onSelect }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}
      style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px', marginBottom: '8px', cursor: 'grab', opacity: isDragging ? 0.3 : 1 }}>
      <p style={{ fontWeight: '500', fontSize: '13px', marginBottom: '6px' }}>{task.title}</p>
      {task.description && <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>{task.description}</p>}
      {task.deadline && (
        <p style={{ fontSize: '11px', color: isNearDeadline(task.deadline) ? '#ef4444' : '#9ca3af', marginBottom: '6px' }}>
          {new Date(task.deadline).toLocaleDateString('vi-VN')}
          {isNearDeadline(task.deadline) && ' !'}
        </p>
      )}
      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }} onPointerDown={e => e.stopPropagation()}>
        <button onClick={() => onSelect(task)} style={{ flex: 1, padding: '4px', background: '#ede9fe', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Comment</button>
        <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value)}
          style={{ flex: 1, padding: '4px', fontSize: '12px', borderRadius: '6px', border: '1px solid #ddd' }}>
          {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <button onClick={() => onDelete(task.id)}
          style={{ padding: '4px 8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Xoa</button>
      </div>
    </div>
  );
}

function Column({ col, tasks, isNearDeadline, onDelete, onStatusChange, onSelect }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  return (
    <div ref={setNodeRef} style={{ background: isOver ? '#f0f0ff' : 'white', borderRadius: '10px', padding: '12px', minHeight: '200px', transition: 'background 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: `3px solid ${col.color}`, paddingBottom: '8px' }}>
        <span style={{ fontWeight: '600', fontSize: '14px', color: col.color }}>{col.label}</span>
        <span style={{ background: '#f3f4f6', borderRadius: '99px', padding: '2px 8px', fontSize: '12px' }}>{tasks.length}</span>
      </div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} isNearDeadline={isNearDeadline} onDelete={onDelete} onStatusChange={onStatusChange} onSelect={onSelect} />
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

  const handleDragStart = (event) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task);
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
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'white', padding: '12px 20px', borderRadius: '10px' }}>
        <h2 style={{ margin: 0 }}>Task Board</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px' }}>Xin chao, <b>{user.fullName}</b></span>
          <button onClick={() => setShowForm(true)} style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ Them task</button>
          <button onClick={logout} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Dang xuat</button>
        </div>
      </div>

      {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} />}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Them task moi</h3>
            <form onSubmit={handleCreate}>
              <input placeholder="Tieu de" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
              <input placeholder="Mo ta" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
              <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}>
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Luu</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', background: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Huy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {COLUMNS.map(col => (
            <Column key={col.id} col={col} tasks={tasks.filter(t => t.status === col.id)}
              isNearDeadline={isNearDeadline} onDelete={handleDelete} onStatusChange={handleStatusChange} onSelect={setSelectedTask} />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <div style={{ background: '#f9fafb', border: '1px solid #6366f1', borderRadius: '8px', padding: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
              <p style={{ fontWeight: '500', fontSize: '13px' }}>{activeTask.title}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}