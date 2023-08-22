const mongoose = require('mongoose');

const opkSchema = mongoose.Schema({
  opk: { type: String },
  name: { type: String },
},{ collection: 'opk' });
opkSchema.set('collection', 'opk');
module.exports = mongoose.model('Opk', opkSchema,'opk');
