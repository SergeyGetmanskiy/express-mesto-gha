const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((e) => res.status(500).send({ message: e.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ message: e.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      }
      return res.status(500).send({ message: e.message });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      res.send({ data: card });
    } else {
      res.status(404).send({ message: 'Передан не существующий _id карточки.' });
    }
  })
  .catch((e) => {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    }
    return res.status(500).send({ message: e.message });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card) {
      res.send({ data: card });
    } else {
      res.status(404).send({ message: 'Передан не существующий _id карточки.' });
    }
  })
  .catch((e) => {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
    }
    return res.status(500).send({ message: e.message });
  });
