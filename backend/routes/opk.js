const express = require("express");
const Opk = require("../models/Opk");
const router = express.Router();



router.post("", (req, res) => {
  // console.log('body:',req.get('Content-Type'),req.body);
  const body=JSON.parse(req.body);
  delete body['_id'];

  const item = new Opk(body);
  item.save().then(data => {
    res.status(201).json(data);
  });
});

router.delete("/:id", (req, res, next) => {
    Opk.deleteOne({ _id: req.params.id }).then(result => {
      // console.log(result);
      res.status(200).json(result);
    });
});

router.put("/:id", (req, res, next) => {
    const opk=JSON.parse(req.body);

    Opk.findByIdAndUpdate({ _id: req.params.id },opk).then(data=>{
      // console.log('put',data);
      res.status(200).json(data)
    })
});

router.get("", (req, res, next) => {
  Opk.find().then(documents => {
    // console.log('documents:',documents)
    res.status(200).json(documents);
  })
});

module.exports = router;
