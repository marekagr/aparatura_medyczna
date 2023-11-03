const mongoose = require('mongoose');

const columnSchema = mongoose.Schema({
  name: { type: String },
},{ collection: 'column' });
columnSchema.set('collection', 'column');
module.exports = mongoose.model('Column', columnSchema,'column');
