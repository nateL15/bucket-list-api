'use strict'

const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJson: { virtuals: true },
  transform: function (doc, ret, options) {
    const userId = (options.user && options.user._id) || false
    ret.editable = userId && userId.equals(doc._owner)
    return ret
  }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item
