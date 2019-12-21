module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobaber',
  define: {
    // registra data de criação e atualização
    timestamps: true,
    underscored: true, // Usa esse formato user_groups
    underscoredAll: true,
  },
};
