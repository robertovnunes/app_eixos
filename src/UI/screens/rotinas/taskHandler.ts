import Toast from 'react-native-toast-message';
import shortid from 'shortid';
import routineStorage from '../../../utils/storage/routine.storage';
import notificationService from '../../../utils/services/NotificationService';
import RoutineTaskDay, { RoutineTaskItem } from 'interfaces/routineTask';

export async function handleAddTask(
  newTask: Partial<RoutineTaskItem>,
  diasDaSemana: number[],
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
  closeModal: () => void,
) {
  try {
    if (!newTask.titulo || !newTask.descricao || !newTask.horario) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos!',
        position: 'bottom',
      });
      return;
    }
    const idNotifications: string[] = [];
    const horario = new Date();
    const [h, m] = newTask.horario.split(':').map(Number);
    horario.setHours(h, m);

    const _taskId = shortid.generate();

    for (const dia of diasDaSemana) {
      const notification = await notificationService.scheduleWeeklyNotification(
        newTask.titulo ?? 'Título não informado',
        newTask.descricao ?? 'Descrição não informada',
        horario,
        dia + 1,
      );
      idNotifications.push(notification);
      if (newTask.reminderTime && newTask.reminderTime.length > 0) {
        for (const reminder of newTask.reminderTime) {
          const reminderDate = new Date(
            horario.getTime() - reminder * 60 * 1000,
          );
          const reminderNotification = await notificationService.scheduleWeeklyNotification(
            'Lembrete:',
            `${newTask.titulo} começará em ${reminder} minutos`,
            reminderDate,
            dia + 1,
          );
          idNotifications.push(reminderNotification);
        }
      }
      const _id = shortid.generate();
      newTask = {
        ...newTask,
        id: _id,
        taskId: _taskId,
        notificationIds: idNotifications,
      } as RoutineTaskItem;
      const task = await routineStorage.saveTask(
       newTask,
        dia,
      );
      
      if (!task) throw new Error('Erro ao salvar tarefa no armazenamento.');

      setTasks((prev) => {
        const updated = [...prev];
        updated[dia].tasks.push(task);
        return updated;
      });
    }

    Toast.show({
      type: 'success',
      text1: 'Tarefa adicionada com sucesso!',
      position: 'bottom',
    });
    closeModal();
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
    Toast.show({
      type: 'error',
      text1: 'Erro ao adicionar tarefa.',
      position: 'bottom',
    });
  }
}

export async function handleDeleteFullRoutineTask(
  taskId: string,
  dia: number,
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
) {
  try {
    const deleted = await routineStorage.deleteTask(taskId, dia, 'all');
    if (!deleted) throw new Error('Erro ao deletar tarefa no armazenamento.');

    setTasks((prev) => {
      const updated = [...prev];
      updated[dia].tasks = updated[dia].tasks.filter(
        (task: RoutineTaskItem) => task.id !== taskId,
      );
      return updated;
    });

    // Cancelar todas as notificações associadas à tarefa
    const task = await routineStorage.getTaskById(taskId);

    Toast.show({
      type: 'success',
      text1: 'Tarefa deletada com sucesso!',
      position: 'bottom',
    });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    Toast.show({
      type: 'error',
      text1: 'Erro ao deletar tarefa.',
      position: 'bottom',
    });
  }
}

export async function handleDeleteRoutineTaskByDay(
  taskId: string,
  dia: number,
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
) {
  try {
    const deleted = await routineStorage.deleteTask(taskId, dia, 'day');
    if (!deleted) throw new Error('Erro ao deletar tarefa no armazenamento.');

    setTasks((prev) => {
      const updated = [...prev];
      updated[dia].tasks = updated[dia].tasks.filter(
        (task: RoutineTaskItem) => task.id !== taskId,
      );
      return updated;
    });

    Toast.show({
      type: 'success',
      text1: 'Tarefa deletada com sucesso!',
      position: 'bottom',
    });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    Toast.show({
      type: 'error',
      text1: 'Erro ao deletar tarefa.',
      position: 'bottom',
    });
  }
}

export async function handleDeleteRoutineTask(
  taskId: string,
  dia: number,
  setTasks: React.Dispatch<React.SetStateAction<any[]>>,
) {
  try {
    const deleted = await routineStorage.deleteTask(taskId, dia, 'task');
    if (!deleted) throw new Error('Erro ao deletar tarefa no armazenamento.');

    setTasks((prev) => {
      const updated = [...prev];
      updated[dia].tasks = updated[dia].tasks.filter(
        (task: RoutineTaskItem) => task.taskId !== taskId,
      );
      return updated;
    });

    Toast.show({
      type: 'success',
      text1: 'Tarefa deletada com sucesso!',
      position: 'bottom',
    });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    Toast.show({
      type: 'error',
      text1: 'Erro ao deletar tarefa.',
      position: 'bottom',
    });
  }
}