import request from 'supertest';
import matchers from 'jest-supertest-matchers';

import app from '../app';
import db from '../app/models';
import createTables from '../app/createTables';
import { initFaker, initTask, getCookieRequest } from '../app/lib/testLib';

const user = initFaker();
const formAuth = {
  email: user.email,
  password: user.password,
  confirmedPassword: user.confirmedPassword,
};

const user2 = initFaker();
const formAuth2 = {
  email: user2.email,
  password: user2.password,
  confirmedPassword: user2.confirmedPassword,
};

const task = initTask();
const taskUpdated = initTask();

describe('basic operations', () => {
  let server;
  let cookie;

  beforeAll(async () => {
    jasmine.addMatchers(matchers);
    await createTables();
    await db.User.create(user);
  });

  beforeEach(async () => {
    server = app().listen();
  });

  it('GET 200 /tasks - show all tasks', async () => {
    const res = await request.agent(server)
      .get('/tasks')
    // expect(res).toHaveHTTPStatus(200);
      .expect(200);
  });

  it('GET 200 /tasks/new - failed auth - form-add-task', async () => {
    await request.agent(server)
      .get('/tasks/new')
      .expect(302);
  });

  it('GET 200 /tasks/new - show form-add-task', async () => {
    const auth = await request.agent(server)
      .post('/session')
      .type('form')
      .send({ form: formAuth });
    cookie = getCookieRequest(auth);
    await request.agent(server)
      .get('/tasks/new')
      .set('cookie', cookie)
      .expect(200);
  });

  it('GET 200 /tasks:id/ - show task', async () => {
    const auth = await request.agent(server)
      .post('/session')
      .type('form')
      .send({ form: formAuth });
    cookie = getCookieRequest(auth);
    await request.agent(server)
      .post('/tasks')
      .set('cookie', cookie)
      .send({ form: task });
    await request.agent(server)
      .get('/tasks/1')
      .expect(200);
  });

  it('GET 200 /tasks:id/ - now such a task', async () => {
    const auth = await request.agent(server)
      .post('/session')
      .type('form')
      .send({ form: formAuth });
    cookie = getCookieRequest(auth);
    await request.agent(server)
      .get('/tasks/3')
      .expect(404);
  });

  afterEach(async () => {
    await server.close();
  });
});

describe('task-creation', () => {
  let server;
  let cookie;

  beforeAll(async () => {
    jasmine.addMatchers(matchers);
    await createTables();
    await db.User.create(user);
  });

  beforeEach(async () => {
    server = app().listen();
    const auth = await request.agent(server)
      .post('/session')
      .type('form')
      .send({ form: formAuth });
    cookie = getCookieRequest(auth);
  });

  it('POST 302 /tasks - add task', async () => {
    const res = await request.agent(server) //
      .get('/tasks/new')
      .set('cookie', cookie)
      .expect(200);
    await request.agent(server)
      .post('/tasks')
      .set('cookie', cookie)
      .send({ form: task })
      .expect(302);
  });

  it('POST 302 /tasks - failed add task', async () => {
    const res = await request.agent(server)
      .post('/tasks')
      .set('cookie', cookie)
      .send({ form: { ...task, name: 'q' } })
      .expect(422);
  });

  it('GET 200 /tasks - show task', async () => {
    const res = await request.agent(server)
      .get('/tasks/1')
      .expect(200);
  });

  it('GET 200 /tasks/:id/edit - no sign-in: edit-task-form', async () => {
    const res = await request.agent(server)
      .get('/tasks/1/edit')
      .expect(302);
  });

  it('GET 200 /tasks/:id/edit - 404: edit-task-form', async () => {
    const res = await request.agent(server)
      .get('/tasks/3/edit')
      .set('cookie', cookie)
      .expect(404);
  });

  it('GET 200 /tasks/:id/edit - show edit-form-task', async () => {
    const res = await request.agent(server)
      .get('/tasks/1/edit')
      .set('cookie', cookie)
      .expect(200);
  });

  it('PATCH 302 /tasks/1 - failed update task - validation', async () => {
    const res = await request.agent(server)
      .patch('/tasks/1')
      .set('cookie', cookie)
      .send({ form: { task, name: 'q' } })
      .expect(422);
  });

  it('PATCH 302 /tasks/1 - update task', async () => {
    const res = await request.agent(server)
      .patch('/tasks/1')
      .set('cookie', cookie)
      .send({ form: taskUpdated })
      .expect(302);
  });

  // it('DELETE 302 /tasks/1 - delete task - validation', async () => {
  //   const res = await request.agent(server)
  //     .delete('/tasks/1')
  //     .set('cookie', cookie)
  //     .send({ form: { ...taskUpdated, name: 'q' } })
  //     .expect(422);
  // }); // add mw - exist!

  it('DELETE 302 /tasks/1 - delete task', async () => {
    const res = await request.agent(server)
      .delete('/tasks/1')
      .set('cookie', cookie)
      .send({ form: taskUpdated })
      .expect(302);
  });

  afterEach(async () => {
    await server.close();
  });
});
