import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointments';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados de agendamento inválido!' });
    }

    const { provider_id, date } = req.body;

    /**
     * Verifica se provider_id é um pretador de serviço
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Não encontrado um prestador de serviço!' });
    }

    /**
     * startOfHour deixa a hora sempre do ínicio e redonda,
     * não quebra em minutos, exemplos: 19h, 20h, 21h...
     */
    const hourStart = startOfHour(parseISO(date));

    /**
     * Verifica se a data do agendamento já passou
     */
    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ error: 'Verifique a data informada! Não permitido.' });
    }
    /**
     * Verifica se o horario está vago
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Horário não disponível' });
    }

    /**
     * Criando agendamento
     */
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart, // Agendamento de hora em hora
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
