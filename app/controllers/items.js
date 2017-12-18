'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Item = models.item

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Item.find({_owner: req.user._id})
    .then(items => res.json({
      items: items.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    item: req.item.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  const item = Object.assign(req.body.item, {
    _owner: req.user._id
  })
  Item.create(item)
    .then(item =>
      res.status(201)
        .json({
          item: item.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body.item._owner  // disallow owner reassignment.

  req.item.update(req.body.item)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.item.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(Item), only: ['show'] },
  { method: setModel(Item, { forUser: true }), only: ['update', 'destroy'] }
] })
