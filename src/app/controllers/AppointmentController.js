import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointments';
import Notification from '../schemas/Notification';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointment = await Appointment.findAll({
      where: { canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
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

    const { provider_id, date, user_id } = req.body;

    /**
     * Verifica se user_id é um usuário
     */
    const isUser = await User.findOne({
      where: { id: user_id, provider: false },
    });

    if (!isUser) {
      return res.status(401).json({ error: 'Usuário não encontrado!' });
    }

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
      user_id,
      provider_id,
      date: hourStart, // Agendamento de hora em hora
    });

    /**
     * Notificando agendamento para o prestador
     */
    const user = await User.findByPk(req.userId);

    const formattedDate = format(hourStart, "dd' de 'MMMM' às 'H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para dia ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    // Id do agendamento
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (req.userId !== appointment.provider_id) {
      return res
        .status(401)
        .json({ error: 'Prestador sem permisão para cancelamento!' });
    }

    /**
     * Regra de cancelamento
     * Hora do agendamento menos 2 horas
     * ou seja, permitido cancelar até 2h antes.
     * Ex: agendamento 12h - 2h = hora do cancelamento 10h
     */
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'Cancelamento fora do horário permitido!' });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    // Fila de email
    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
