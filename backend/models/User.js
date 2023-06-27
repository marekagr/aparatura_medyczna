const mongoose = require('mongoose');
const uniqueValidator=require("mongoose-unique-validator")

const userSchema = mongoose.Schema({
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  grantMenu : [{grantMenuId: { type: mongoose.Schema.Types.ObjectId, ref: 'GrantMenu' }}],
  grantDirectory : [{grantDirectoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'GrantDirectory' }}],
},{ collection: 'user' });
userSchema.set('collection', 'user');

userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema,'user');
