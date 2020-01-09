import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserContorller {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Dados inválidos, conferir os campos informados!' });
    }

    // Consulta no Banco de dados se o usuário existe.
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Criando usuário no Banco de dados.
    const user = await User.create(req.body);

    // Retornando tudo.
    return res.json(user);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(6)
        .when(
          // field se refere ao próprio campo.
          'oldPassword',
          (oldPassword, field) => (oldPassword ? field.required() : field)
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        // oneOf([Yup.ref('password')]) obriga os campos a ter o mesmo valor
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Dados inválidos, conferir os campos informados!' });
    }

    const { email, oldPassword } = req.body;

    /* Buscando no Banco de dados o usuário,
       através do id do Usuário que está no Token */
    const user = await User.findByPk(req.userId);

    // Verifica se o usuário vai trocar o email.
    if (email !== user.email) {
      // Verifica se o usuário está cadastrado no Banco de dados.
      const userExist = await User.findOne({ where: { email } });

      if (userExist) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
    }

    // Verifica se a nova senha é diferente da antiga senha
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Nova senha igual a antiga senha' });
    }

    // Atualizando as informações do Usuário no Banco de dados.
    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          atributes: ['path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default new UserContorller();
