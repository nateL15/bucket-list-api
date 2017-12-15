'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const listItem = models.listItem

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  listItem.findById({ _id: req.user._id })
    .then(listItems => res.json({
      listItems: listItems.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    listItem: req.listItem.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  const listItem = Object.assign(req.body.listItem, {
    _owner: req.user._id
  })
  listItem.create(listItem)
    .then(listItem =>
      res.status(201)
        .json({
          listItem: listItem.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body.listItem._owner  // disallow owner reassignment.

  req.listItem.update(req.body.listItem)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.listItem.remove()
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
  { method: setModel(listItem), only: ['show'] },
  { method: setModel(listItem, { forUser: true }), only: ['update', 'destroy'] }
] })
