const express = require("express");
const Employee = require("../models/Employee");
const router = express.Router();



router.post("", (req, res) => {
  // console.log('body:',req.get('Content-Type'),req.body);
  const body=JSON.parse(req.body);
  delete body['_id'];

  const item = new Employee(body);
  item.save().then(data => {
    res.status(201).json(data);
  });
});

router.delete("/:id", (req, res, next) => {
    Employee.deleteOne({ _id: req.params.id }).then(result => {
      // console.log(result);
      res.status(200).json(result);
    });
});

router.put("/:id", (req, res, next) => {
    const eventType=JSON.parse(req.body);
    // console.log('put petrol',eventType);
    Employee.findByIdAndUpdate({ _id: req.params.id },eventType).then(data=>{
      // console.log('put',data);
      res.status(200).json(data)
    })
});

router.get("", (req, res, next) => {
  Employee.find().collation({ locale: "pl" }).sort({ surname: 1,name:1 }).then(documents => {
    // console.log('employee:',documents)
    res.status(200).json(documents);
});
});

module.exports = router;
