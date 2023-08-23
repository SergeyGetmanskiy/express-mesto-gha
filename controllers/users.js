const User = require('../models/user');
const { ERR_BAD_REQUEST, ERR_NOT_FOUND, ERR_DEFAULT } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((e) => res.status(ERR_DEFAULT).send({ message: e.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для поиска пользователя.' });
      }
      if (e.name === 'DocumentNotFoundError') {
        return res.status(ERR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(ERR_DEFAULT).send({ message: e.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(ERR_BAD_REQUEST).send({ message: `Переданы некорректные данные при создании пользователя. ${e.message}` });
      }
      return res.status(ERR_DEFAULT).send({ message: e.message });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(ERR_DEFAULT).send({ message: e.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(ERR_DEFAULT).send({ message: e.message });
    });
};
