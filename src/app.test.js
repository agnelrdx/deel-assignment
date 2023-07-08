const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('./app');
const { sequelize } = require('./model');

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /profiles', () => {
  it('should return clients with the specified type', async () => {
    const data = [
      {
        'id': 1,
        'firstName': 'Harry',
        'lastName': 'Potter',
        'profession': 'Wizard',
        'balance': 1150,
        'type': 'client',
        'createdAt': '2023-06-29T22:00:17.988Z',
        'updatedAt': '2023-06-29T22:00:17.988Z',
      },
      {
        'id': 2,
        'firstName': 'Mr',
        'lastName': 'Robot',
        'profession': 'Hacker',
        'balance': 231.11,
        'type': 'client',
        'createdAt': '2023-06-29T22:00:17.988Z',
        'updatedAt': '2023-06-29T22:00:17.988Z',
      },
    ];
    const findAllStub = sinon
      .stub(sequelize.models.Profile, 'findAll')
      .resolves(data);

    const response = await chai
      .request(app)
      .get('/profiles')
      .query({ type: 'client' });

    expect(response).to.have.status(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(2);
    expect(response.body[0]).to.deep.equal(data[0]);
    expect(response.body[1]).to.deep.equal(data[1]);

    findAllStub.restore();
  });

  it('should return 404 if no clients found', async () => {
    const findAllStub = sinon
      .stub(sequelize.models.Profile, 'findAll')
      .resolves(null);

    const response = await chai
      .request(app)
      .get('/profiles')
      .query({ type: 'client' });

    expect(response).to.have.status(404);

    findAllStub.restore();
  });
});

describe('POST /login', () => {
  it('should log in the user and set the profile_id cookie', async () => {
    const profileId = 1;

    const findOneStub = sinon
      .stub(sequelize.models.Profile, 'findOne')
      .resolves({
        'id': 1,
        'firstName': 'Harry',
        'lastName': 'Potter',
        'profession': 'Wizard',
        'balance': 1150,
        'type': 'client',
        'createdAt': '2023-06-29T22:00:17.988Z',
        'updatedAt': '2023-06-29T22:00:17.988Z',
      });

    const response = await chai.request(app).post('/login');

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ status: true });
    expect(response).to.have.cookie('profile_id', profileId.toString());

    findOneStub.restore();
  });

  it('should return 401 for invalid login', async () => {
    const findOneStub = sinon
      .stub(sequelize.models.Profile, 'findOne')
      .resolves(null);

    const response = await chai.request(app).post('/login');

    expect(response).to.have.status(401);

    findOneStub.restore();
  });
});

describe('POST /logout', () => {
  it('should log out the user and clear the profile_id cookie', async () => {
    const response = await chai.request(app).post('/logout');

    expect(response).to.redirectTo(/127.0.0.1/);
    expect(response).to.not.have.cookie('profile_id');
  });
});

describe('POST /jobs/:job_id/pay', () => {
  it('should pay for the job if balance is greater than the payment amount', async () => {
    const jobId = 1;
    const jobPrice = 100;
    const findOneProfileStub = sinon
      .stub(sequelize.models.Profile, 'findOne')
      .resolves({
        'id': 1,
        'firstName': 'Harry',
        'lastName': 'Potter',
        'profession': 'Wizard',
        'balance': 1000,
        'type': 'client',
        'createdAt': '2023-06-29T22:00:17.988Z',
        'updatedAt': '2023-06-29T22:00:17.988Z',
      });

    const findOneJobStub = sinon
      .stub(sequelize.models.Job, 'findOne')
      .resolves({ id: jobId, price: jobPrice });

    const updateJobStub = sinon.stub(sequelize.models.Job, 'update').resolves();

    const updateProfileStub = sinon
      .stub(sequelize.models.Profile, 'update')
      .resolves();

    const response = await chai.request(app).post(`/jobs/${jobId}/pay`);

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ status: true });

    findOneProfileStub.restore();
    findOneJobStub.restore();
    updateJobStub.restore();
    updateProfileStub.restore();
  });

  it('should return 400 if the profile balance is insufficient', async () => {
    const jobId = 1;
    const jobPrice = 1000;
    const findOneProfileStub = sinon
      .stub(sequelize.models.Profile, 'findOne')
      .resolves({
        'id': 1,
        'firstName': 'Harry',
        'lastName': 'Potter',
        'profession': 'Wizard',
        'balance': 100,
        'type': 'client',
        'createdAt': '2023-06-29T22:00:17.988Z',
        'updatedAt': '2023-06-29T22:00:17.988Z',
      });

    const findOneJobStub = sinon
      .stub(sequelize.models.Job, 'findOne')
      .resolves({ id: jobId, price: jobPrice });

    const response = await chai.request(app).post(`/jobs/${jobId}/pay`);

    expect(response).to.have.status(400);

    findOneProfileStub.restore();
    findOneJobStub.restore();
  });
});

describe('POST /balances/deposit/:userId', () => {
  it('should add deposit if the amount is less than 25% his total of jobs to pay.', async () => {
    const findOneProfileStub = sinon
      .stub(sequelize.models.Profile, 'findOne')
      .resolves({
        'id': 1,
        'firstName': 'Harry',
        'lastName': 'Potter',
        'profession': 'Wizard',
        'balance': 1000,
        'type': 'client',
        'createdAt': '2023-06-29T22:00:17.988Z',
        'updatedAt': '2023-06-29T22:00:17.988Z',
      });

    const findAllContractStub = sinon
      .stub(sequelize.models.Contract, 'findAll')
      .resolves([
        {
          id: 1,
        },
      ]);
    const findAllJobStub = sinon
      .stub(sequelize.models.Job, 'findAll')
      .resolves([
        {
          price: 100,
        },
        {
          price: 200,
        },
      ]);
    const updateProfileStub = sinon
      .stub(sequelize.models.Profile, 'update')
      .resolves();

    const response = await chai.request(app).post(`/balances/deposit/1`).send({
      amount: 75, // 25% his total of jobs to pay
    });

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ status: true });

    findOneProfileStub.restore();
    findAllContractStub.restore();
    findAllJobStub.restore();
    updateProfileStub.restore();
  });

  it('should return 400 if the amount is greater than 25% his total of jobs to pay.', async () => {
    const findOneProfileStub = sinon
      .stub(sequelize.models.Profile, 'findOne')
      .resolves({
        'id': 1,
        'firstName': 'Harry',
        'lastName': 'Potter',
        'profession': 'Wizard',
        'balance': 1000,
        'type': 'client',
        'createdAt': '2023-06-29T22:00:17.988Z',
        'updatedAt': '2023-06-29T22:00:17.988Z',
      });

    const findAllContractStub = sinon
      .stub(sequelize.models.Contract, 'findAll')
      .resolves([
        {
          id: 1,
        },
      ]);
    const findAllJobStub = sinon
      .stub(sequelize.models.Job, 'findAll')
      .resolves([
        {
          price: 100,
        },
        {
          price: 200,
        },
      ]);
    const updateProfileStub = sinon
      .stub(sequelize.models.Profile, 'update')
      .resolves();

    const response = await chai.request(app).post(`/balances/deposit/1`).send({
      amount: 100, // 25% his total of jobs to pay
    });

    expect(response).to.have.status(400);

    findOneProfileStub.restore();
    findAllContractStub.restore();
    findAllJobStub.restore();
    updateProfileStub.restore();
  });

  it('should add deposit if there are no jobs to pay.', async () => {
    const findOneProfileStub = sinon
      .stub(sequelize.models.Profile, 'findOne')
      .resolves({
        'id': 1,
        'firstName': 'Harry',
        'lastName': 'Potter',
        'profession': 'Wizard',
        'balance': 1000,
        'type': 'client',
        'createdAt': '2023-06-29T22:00:17.988Z',
        'updatedAt': '2023-06-29T22:00:17.988Z',
      });

    const findAllJobStub = sinon
      .stub(sequelize.models.Job, 'findAll')
      .resolves([]);

    const updateProfileStub = sinon
      .stub(sequelize.models.Profile, 'update')
      .resolves();

    const response = await chai.request(app).post(`/balances/deposit/1`).send({
      amount: 100000,
    });

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ status: true });

    findOneProfileStub.restore();
    findAllJobStub.restore();
    updateProfileStub.restore();
  });
});
