import request from 'supertest';
import matchers from 'jest-supertest-matchers';

import app from '../app';
import { User } from '../app/models';
import { initFaker } from './utils';

describe('requests', () => {
  let server;
  let user;

  beforeAll(() => {
    jasmine.addMatchers(matchers);
    user = initFaker()();
  });

  beforeEach(async () => {
    server = app().listen();
    await User.sync({ force: true });
  });

  it('GET root', async () => {
    const res = await request.agent(server)
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET 404 / = wwrong path', async () => {
    const res = await request.agent(server)
      .get('/wrong-path');
    expect(res).toHaveHTTPStatus(404);
  });

  it('GET /users/new - show sign-up form', async () => {
    const res = await request.agent(server)
      .get('/users/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET 200 /users - show users', async () => {
    const res = await request.agent(server)
      .get('/users');
    expect(res).toHaveHTTPStatus(200);
  });

  it('POST /users - create user', async () => {
    const res = await request.agent(server)
      .post('/users')
      .type('form')
      .send({ form: user });
    expect(res).toHaveHTTPStatus(302);
    const userDb = await User.findOne({
      where: { email: user.email },
    });
    expect(user.firstName).toMatch(userDb.firstName);
    expect(user.lastName).toMatch(userDb.lastName);
  });

  afterEach(async () => {
    await server.close();
  });
});