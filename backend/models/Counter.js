const mongoose = require('mongoose');



const counterSchema = mongoose.Schema({
  _id: {type: String, required: true},
  seq: { type: Number, default: 0 },
  __v:Number
},{ collection: 'counter' },{ timestamps: true });
counterSchema.set('collection', 'counter');
// console.log(app.connection)
module.exports = mongoose.model('Counter', counterSchema,'counter');

