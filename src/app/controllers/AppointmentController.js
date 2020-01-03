import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointments';

class AppointmentController {
  async index(_, res) {
    const appointment = await Appointment.findAll({
      where: { canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider', // Pegando o apelido pois ele tem mais de um relacionamento
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          ],
        },
      ],
    });

    return res.json(appointment);
  }

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
     * Verifica se provider_id é um prestador de serviço
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({ error: 'Não é um prestador de serviço!' });
    }

    /**
     * startOfHour deixa a hora sempre do ínicio e redonda,
     * não quebra em minutos, exemplos: 19h, 20h, 21h...
     * Se usar 19h38 a hora passa para 19h
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
