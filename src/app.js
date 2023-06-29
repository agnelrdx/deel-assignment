const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');

const app = express();

app.use(cors({ credentials: true, origin: 'http://127.0.0.1:5173' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.disable('x-powered-by');
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

app.get('/profile', getProfile, async (req, res) => {
  res.json(req.profile);
});

app.get('/contracts/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const contract = await Contract.findOne({ where: { id } });
  if (!contract) return res.status(404).end();
  res.json(contract);
});

app.post('/login', async (req, res) => {
  const { Profile } = req.app.get('models');
  const { id } = req.body;
  const profile = await Profile.findOne({ where: { id } });
  if (!profile) return res.status(404).end();
  res.cookie('profile_id', profile.id, {
    maxAge: 1000 * 60 * 20,
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
  });
  res.json({ status: true });
});

module.exports = app;
