const mongoose = require('mongoose');
const Counter = require("./Counter");
const Register = require("./Register");


const representativeSchema = mongoose.Schema({
  name:{type:String,required:true},
  surname:{type:String,required:true},
  // function:{type:String,required:true},
},{ timestamps: true });

const cofinancing = mongoose.Schema({
  source:{type:String,required:true},
  value:{type:Number,required:true},
},{ timestamps: true });

const information = mongoose.Schema({
  info:{type:String,required:true},
  date:Date
},{ timestamps: true });

const plik = mongoose.Schema({
  filename:{type:String,required:true},
  path:{type:String,required:true},
},{ timestamps: true });

const registerSchema = mongoose.Schema({
  own_number_of_deal:Number,
  number_of_deal:{type:String,required:true,unique:true},
  type_of_deal:String,
  deal_name: String,

  date_of_sign:{type:Date,required:true},
  place_of_sign:{type:String,required:true},
  date_of_deal_start:{type:Date,required:true},
  date_of_deal_stop:{type:Date},

  part1_of_deal:{type:String,required:true},
  part2_of_deal:{type:String,required:true},
  representative1_of_deal:[representativeSchema],
  representative2_of_deal:[representativeSchema],

  issue_of_deal:String,
  value_of_deal:String,
  status:String,

  date_of_registration:{type:Date},
  registration_business_unit:String,
  registration_person:String,

  cofinancing:[cofinancing],
  changeDeal:[information],
  terminationWithDeal:[information],
  terminationRest:[information],

  files:[plik],

  __v:Number
},{ timestamps: true },{ collection: 'register' });
registerSchema.set('collection', 'register');

// registerSchema.post('validate', function(doc) {
//   console.log('1',doc);
//   doc.validate(function (err) {
//     if (err) {console.log('validate error post validate');}
//     else {console.log('OK validate post validate')}
//   });
// });
// registerSchema.pre('save', function(error, doc, next) {
//   console.log('post save',error,error.code,error.name)
//   if (error.name === 'MongoServerError' && error.code === 11000) {
//     console.log('MongoServerError')
//     next(new Error('There was a duplicate key error'));
//   } else {
//     console.log('error next')
//     // next();
//   }
// });

registerSchema.pre('save', function(next) {
  var doc = this;
  doc.validate(function (err) {
    if (err) {console.log('validate error post');}
    else {console.log('OK validate post')}
  });
 


  if(doc.isNew){
  Counter.findOneAndUpdate(
      {_id: 'registerId'},
      {$inc: { seq: 1} },
      {new: true, upsert: true}).
      then(function(count) {
        console.log("...count: "+JSON.stringify(count));
        doc.own_number_of_deal = count.seq;
      next();
    })
    .catch(function(error) {
      console.error("counter error-> : "+error);
      throw error;
    });
  }
  else next()
});


// registerSchema.pre('validate', function(doc) {
//   doc.validate(function (err) {
//     if (err) {console.log('validate error post');}
//     else {console.log('OK validate post')}
//   });
//   console.log('%s has been validated (but not saved yet)');
// });

// registerSchema.pre('save', function(error,res,next) {
//   var doc = this;
//   // doc.validate(function (err) {
//   //   if (err) {console.log('validate error')}
//   //   else {console.log('OK validate')}
//   // });
//   if(doc.isNew){
//   Counter.findOneAndUpdate(
//       {_id: 'registerId'},
//       {$inc: { seq: 1} },
//       {new: true, upsert: true}).
//       then(function(count) {
//         console.log("...count: "+JSON.stringify(count));
//         doc.own_number_of_deal = count.seq;
//       next();
//     })
//     .catch(function(error) {
//       console.error("counter error-> : "+error);
//       throw error;
//     });
//   }
//   else next()
// });


module.exports = mongoose.model('Register', registerSchema,'register');

