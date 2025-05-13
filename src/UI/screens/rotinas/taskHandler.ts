import Toast from 'react-native-toast-message';
import shortid from 'shortid';
import routineStorage from '../../../utils/storage/routine.storage';
import notificationService from '../../../utils/services/NotificationService';
import Task, { SubTask } from 'interfaces/Task';
export async function handleAddTask(
  newTask: Partial<Task>,
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
        concluido: false,
        importante: false,
        urgente: false,
        prioridade: 0,
      } as Task;
      await routineStorage.insertTask(dia, _id);
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
