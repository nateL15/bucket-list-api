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
  toJson: { virtuals: true }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item
