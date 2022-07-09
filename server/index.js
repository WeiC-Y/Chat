const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const messageRouter = require('./routes/messagesRoute');
const socket = require('socket.io'); // 引入socket实现双向响应

const app = express();
require('dotenv').config(); // 导入环境配置文件 .env

app.use(cors()); // cors跨域
app.use(express.json()); // 将传入对象识别为JSON的中间件

// 引入路由
app.use('/api/auth', userRouter);
app.use('/api/message', messageRouter);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connect successful!');
  })
  .catch(err => {
    console.log(`ERR: ${err.message}`);
  }); // 连接mongo数据库

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}!`);
});

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on('connection', socket => {
  global.chatSocket = socket;
  socket.on('add-users', userId => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', data => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.message);
    }
  });
});
