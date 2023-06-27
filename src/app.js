const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

/**
 * FIX ME!
 * @returns contract by id
 */

app.get('/clients', async (req, res) => {
  const { Profile } = req.app.get('models');
  const clients = await Profile.findAll({ where: { type: 'client' } });
  if (!clients) return res.status(404).end();
  res.json(clients);
});

app.get('/contracts/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const contract = await Contract.findOne({ where: { id } });
  if (!contract) return res.status(404).end();
  res.json(contract);
});

module.exports = app;
