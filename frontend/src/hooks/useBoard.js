import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';

export function useBoard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const res = await taskService.getAll();
      setTasks(res.data);
    } catch {
      navigate('/');
    }
  };

  const createTask = async (form, userId) => {
    await taskService.create({ ...form, assigneeId: userId });
    loadTasks();
  };

  const updateStatus = async (id, status) => {
    await taskService.updateStatus(id, status);
    loadTasks();
  };

  const deleteTask = async (id) => {
    if (window.confirm('Xóa công việc này?')) {
      await taskService.delete(id);
      loadTasks();
    }
  };

  const toggleImportant = async (id) => {
    await taskService.toggleImportant(id);
    loadTasks();
  };

  const isNearDeadline = (deadline) => {
    if (!deadline) return false;
    const diff = (new Date(deadline) - new Date()) / 86400000;
    return diff >= 0 && diff <= 2;
  };

  return { tasks, loadTasks, createTask, updateStatus, deleteTask, toggleImportant, isNearDeadline };
}
