import Toast from 'react-native-toast-message';
import shortid from 'shortid';
import routineStorage from '../../../utils/storage/routine.storage';
import taskStorage from '../../../utils/storage/tasks.storage';
import notificationService from '../../../utils/services/NotificationService';
import Task, { SubTask } from 'interfaces/Task';
import Rotina from 'interfaces/Rotina';

export async function handleAddTask(
  task: Partial<Task>,
  diasDaSemana: number[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setRoutine: React.Dispatch<React.SetStateAction<Rotina[]>>,
  closeModal: () => void,
) {
  try {
    if (!task.titulo || !task.descricao || !task.horario) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos!',
        position: 'bottom',
      });
      return;
    }
    const idNotifications: string[] = [];
    const horario = new Date();
    const [h, m] = task.horario.split(':').map(Number);
    horario.setHours(h, m);
    const _id = shortid.generate();

    for (const dia of diasDaSemana) {
      const notification = await notificationService.scheduleWeeklyNotification(
        task.titulo ?? 'Título não informado',
        task.descricao ?? 'Descrição não informada',
        horario,
        dia + 1,
      );
      idNotifications.push(notification);
      if (task.reminderTime && task.reminderTime.length > 0) {
        for (const reminder of task.reminderTime) {
          const reminderDate = new Date(
            horario.getTime() - reminder * 60 * 1000,
          );
          const reminderNotification =
          await notificationService.scheduleWeeklyNotification(
            'Lembrete:',
            `${task.titulo} começará em ${reminder} minutos`,
            reminderDate,
            dia + 1,
          );
          idNotifications.push(reminderNotification);
        }
      }
      
      await routineStorage.insertTask(dia, _id);
      setRoutine((prev) => {
        const updatedRotina = [...prev];
        const rotinaIndex = updatedRotina.findIndex((r) => r.dia === dia);
        if (rotinaIndex !== -1) {
          updatedRotina[rotinaIndex].tarefas.push(_id);
        }
        return updatedRotina;
      });
      
    }
    const newTask: Task = {
      id: _id,
      notificationIds: idNotifications,
      concluido: task.concluido || false,
      importante: task.importante || false,
      urgente: task.urgente || false,
      prioridade: task.prioridade || 0,
      data: task.data || null,
      horario: task.horario || null,
      titulo: task.titulo || '',
      descricao: task.descricao || '',
      weekday: task.weekday || null,
      reminderTime: task.reminderTime || null,
      subtasks: task.subtasks || [],
    };
    await taskStorage.add(newTask);
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
