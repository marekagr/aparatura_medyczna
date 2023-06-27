const mongoose = require('mongoose');

const grantDirectorySchema = mongoose.Schema({
  name: { type: String },
},{ collection: 'grantDirectory' });
grantDirectorySchema.set('collection', 'grantDirectory');
module.exports = mongoose.model('GrantDirectory', grantDirectorySchema,'grantDirectory');

