const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Op } = require('sequelize');
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
 * Routes
 */
app.get('/profiles', async (req, res) => {
  const { type } = req.query;
  const { Profile } = req.app.get('models');
  const clients = await Profile.findAll({ where: { type } });
  if (!clients) return res.status(404).end();
  res.json(clients);
});

app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  const { Profile, Contract, Job } = req.app.get('models');
  const profile = await Profile.findOne({ where: { id: userId } });

  const contracts = await Contract.findAll({
    where: { ClientId: userId, status: { [Op.ne]: 'terminated' } },
  });
  const contractIds = contracts.map((v) => v.id);
  const jobs = await Job.findAll({
    where: { paid: false, ContractId: { [Op.in]: contractIds } },
  });
  const total = jobs.reduce((acc, v) => acc + v.price, 0);
  const percentagePayable = (25 / 100) * total;

  if (percentagePayable !== 0 && amount > percentagePayable)
    return res.status(400).end();

  const sum = profile.balance + amount;
  await Profile.update(
    { balance: sum, updatedAt: new Date().toISOString() },
    { where: { id: userId } }
  );
  res.json({ status: true });
});

app.get('/jobs', getProfile, async (req, res) => {
  const { contractorId } = req.query;
  const { Contract, Job } = req.app.get('models');
  const contracts = await Contract.findAll({
    where: { ContractorId: contractorId, status: { [Op.ne]: 'terminated' } },
  });
  const contractIds = contracts.map((v) => v.id);
  const jobs = await Job.findAll({
    where: { ContractId: { [Op.in]: contractIds } },
  });
  res.json(jobs);
});

app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
  const { job_id } = req.params;
  const { Profile, Job } = req.app.get('models');
  const job = await Job.findOne({
    where: { id: job_id },
  });
  const balance = req.profile.balance;
  if (balance < job.price) return res.status(400).end();

  await Job.update(
    {
      paid: true,
      paymentDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { where: { id: job_id } }
  );
  await Profile.update(
    {
      balance: (balance - job.price).toFixed(2),
      updatedAt: new Date().toISOString(),
    },
    { where: { id: req.profile.id } }
  );
  res.json({ status: true });
});

app.get('/admin/best-profession', async (req, res) => {
  const { start, end } = req.query;
  const [results] = await sequelize.query(
    `SELECT * from Jobs
      LEFT JOIN Contracts ON Jobs.ContractId = Contracts.id
      LEFT JOIN Profiles ON Contracts.ContractorId = Profiles.id
      WHERE paid = true AND status != 'terminated' AND Jobs.updatedAt >= '${start}' AND Jobs.updatedAt <= '${end}'
    `
  );
  const bestProfession = results?.reduce((prev, current) => {
    return prev.price > current.price ? prev : current;
  }, {});
  res.json(bestProfession);
});

app.get('/admin/best-clients', async (req, res) => {
  const { start, end, limit } = req.query;
  const { Profile, Contract, Job } = req.app.get('models');
  const jobs = await Job.findAll({
    where: {
      paid: true,
      updatedAt: { [Op.between]: [start, end] },
    },
  });
  const contractIds = jobs.map((v) => v.ContractId);
  const contracts = await Contract.findAll({
    where: { id: { [Op.in]: contractIds } },
  });
  const clientIds = contracts.map((v) => v.ClientId);
  const clients = await Profile.findAll({
    limit: limit || 2,
    where: { id: { [Op.in]: clientIds } },
  });

  res.json(clients);
});

app.post('/login', async (req, res) => {
  const { id } = req.body;
  const { Profile } = req.app.get('models');
  const profile = await Profile.findOne({ where: { id } });
  if (!profile) return res.status(401).end();
  res.cookie('profile_id', profile.id, {
    maxAge: 1000 * 60 * 20,
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
  });
  res.json({ status: true });
});

app.post('/logout', async (_, res) => {
  res.clearCookie('profile_id', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
  });
  res.redirect('/');
});

module.exports = app;
