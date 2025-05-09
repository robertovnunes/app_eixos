import Task, { SubTask } from 'interfaces/Task';
interface TaskViewProps {
  taskId: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
}

/**
 * Show al informations about one task, this is to edit or visualize complete task
 * @param taskId: id from task to visualize
 * @param tasks: List to all tasks
 * @param setTasks: function to update tasks list
 */

const TaskView: React.FC<TaskViewProps> = ({ taskId, tasks, setTasks }) => {

  return (
    <>
    </>
  )

}

export default TaskView;