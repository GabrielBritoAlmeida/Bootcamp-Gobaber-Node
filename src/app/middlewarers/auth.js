import jwt from 'jsonwebtoken';

import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Buscando do Header do metodo Update
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não encontrado!' });
  }

  const [, token] = authHeader.split(' ');

  try {
    /*
     Promisify evita o uso de uma funcão callback,
     recebendo a função que teria o callback.
      Promisify também retorna uma função,
      por esse motivo o trecho: promisify(jwt.verify)(token, authConfig.secret)
      essa função recebe apenas token e secret como paremetro.
    */
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // decoded recebe o id do token, identificando o usuário
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.json({ error: 'Token inválido!' });
  }
};
