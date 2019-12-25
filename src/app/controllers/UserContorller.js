import User from '../models/User';

class UserContorller {
  async store(req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const user = await User.create(req.body);

    return res.json(user);
  }

  async update(req, res) {
    console.log(req.userId);

    return res.json({ ok: true });
  }
}

export default new UserContorller();
