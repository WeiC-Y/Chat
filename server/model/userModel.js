const mongoose = require('mongoose');

// 用户表模型
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true, // 唯一索引 不可重复
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  isAvatarImageSet: { // 是否设置头像
    type: Boolean,
    default: false,
  },
  avatarImage: { // 头像
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Users', userSchema);
