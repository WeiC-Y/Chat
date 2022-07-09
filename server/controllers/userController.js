const User = require('../model/userModel');
const bcrypt = require('bcrypt');

// 注册事件
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 校验数据 正确返回true 错误返回false
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: 'Username already used', status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: 'Email already used', status: false });
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    // 将加密后的密码存到数据库中
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    // 删除传入user对象的密码
    delete user.password;
    // 返回保存后的user对象
    return res.json({ status: true, user });
  } catch (e) {
    next(e);
  }
};

// 登录事件
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // 校验数据 正确返回true 错误返回false
    const user = await User.findOne({ username });
    if (!user)
      // 未找到用户
      return res.json({
        msg: 'Incorrect username or password.',
        status: false,
      });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      // 密码错误
      return res.json({
        msg: 'Incorrect username or password.',
        status: false,
      });
    delete user.password;
    // 返回保存后的user对象
    return res.json({ status: true, user });
  } catch (e) {
    next(e);
  }
};

// 设置头像
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    const userData = await User.findById(userId);
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (e) {
    next(e);
  }
};

// 设置头像
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      'email',
      'username',
      'avatarImage',
      '_id',
    ]);
    return res.json(users);
  } catch (e) {
    next(e);
  }
};
