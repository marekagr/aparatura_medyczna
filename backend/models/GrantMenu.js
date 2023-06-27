const mongoose = require('mongoose');

const grantMenuSchema = mongoose.Schema({
  name: { type: String },
},{ collection: 'grantMenu' });
grantMenuSchema.set('collection', 'grantMenu');
module.exports = mongoose.model('GrantMenu', grantMenuSchema,'grantMenu');
