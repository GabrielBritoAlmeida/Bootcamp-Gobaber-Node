require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    // registra data de criação e atualização
    timestamps: true,
    underscored: true, // Usa esse formato user_groups
    underscoredAll: true,
  },
};
