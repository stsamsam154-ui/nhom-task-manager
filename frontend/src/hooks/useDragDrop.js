import { useState } from 'react';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { COLUMNS } from '../config/seasonConfig';

export function useDragDrop(tasks, updateStatus, onDropSuccess) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return false;

    const draggedTask = tasks.find(t => t.id === active.id);
    if (!draggedTask) return false;

    const newStatus = over.id;
    if (COLUMNS.find(c => c.id === newStatus) && draggedTask.status !== newStatus) {
      await updateStatus(draggedTask.id, newStatus);
      if (onDropSuccess) onDropSuccess(newStatus);
      return true;
    }
    return false;
  };

  return { sensors, activeTask, handleDragStart, handleDragEnd };
}
