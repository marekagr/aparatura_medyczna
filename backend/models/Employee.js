const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  role:{ type: String, required: true },

},{ collection: 'employee' });
employeeSchema.set('collection', 'employee');


module.exports = mongoose.model('Employee', employeeSchema,'employee');
