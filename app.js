const express = require('express');

const { sequelize, User, Task, Knowledge } = require('./models');

const app = express();
app.use(express.json());

// Register new user

app.post('/register', async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const user = await User.create({ name, email, role });

    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Get user list

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();

    return res.json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get specific user with tasks

app.get('/users/:uuid', async (req, res) => {
  const uuid = req.params.uuid;

  try {
    const user = await User.findOne({
      where: { uuid },
      include: 'tasks',
    });

    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// Delete specific user

app.delete('/users/:uuid', async (req, res) => {
  const uuid = req.params.uuid;

  try {
    const user = await User.findOne({ where: { uuid } });

    await user.destroy();

    return res.json({ message: 'User deleted!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// Edit specific user profile

app.put('/users/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  const { name, email, role } = req.body;

  try {
    const user = await User.findOne({ where: { uuid } });

    user.name = name;
    user.email = email;
    user.role = role;

    await user.save();

    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// Create task

app.post('/task', async (req, res) => {
  const { userUuid, title, taskCategory, taskDescription } = req.body;

  try {
    const user = await User.findOne({ where: { uuid: userUuid } });

    const post = await Task.create({ title, taskCategory, taskDescription, userId: user.id });

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Get all task from user

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll({ include: [{model: User, as: 'user'},{model: Knowledge, as: 'knowledges'}] });

    return res.json(tasks);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Create task description

app.post('/createdescription', async (req, res) => {
  const { taskUuid, title, body } = req.body;

  try {
    const task = await Task.findOne({ where: { uuid: taskUuid } });

    const post = await Knowledge.create({ title, body, knowledgeId: task.id });

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.listen({ port: 5000 }, async () => {
  console.log('Server up on http://localhost:5000');
  await sequelize.authenticate();
  console.log('Database Connected!');
});
