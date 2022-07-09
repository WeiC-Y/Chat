const MessageModel = require('../model/messageModel');

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await MessageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: 'Message added successfully.' });
    else return res.json({ msg: 'Failed to add message to the database.' });
  } catch (e) {
    next(e);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await MessageModel.find({
      users: {
        $all: [from, to], // 获取这两个用户的全部消息
      },
    }).sort({ updatedAt: 1 }); // 并根据时间顺序排序

    const projectMessages = messages.map(msg => {
      // 经过处理后的数据 划分出自己发出的消息以及别人回复的消息
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.json(projectMessages);
  } catch (e) {
    next(e);
  }
};
