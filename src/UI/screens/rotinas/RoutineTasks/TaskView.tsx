import React, { useState, useEffect } from 'react';
import Task, { SubTask } from 'interfaces/Task';
import routineStorage from '../../../../utils/storage/routine.storage';
interface TaskViewProps {
  taskId: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
}

/**
 * Show all informations about one task, this is to edit or visualize complete task
 * @param taskId: id from task to visualize
 * @param tasks: List to all tasks
 * @param setTasks: function to update tasks list
 */

const TaskView: React.FC<TaskViewProps> = ({ taskId, tasks, setTasks }) => {

  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
    }
  }, [taskId, tasks]);
  return (
    <>
      {task ? (
        <div>
          <h2>Task Details</h2>
          <p>ID: {task.id}</p>
          <p>Day: {task.weekday}</p>
          <h3>Subtasks:</h3>
          <ul>
            {task.subtasks.map((subTask, index) => (
              <li key={index}>{subTask.titulo}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Task not found</p>
      )}
    </>
  )

}

export default TaskView;