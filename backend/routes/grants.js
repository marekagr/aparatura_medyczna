const express = require("express");
const GrantDirectory = require("../models/GrantDirectory");
const GrantMenu = require("../models/GrantMenu");
const Column = require("../models/Column")
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

router.get("/menu", (req, res, next) => {
  GrantMenu.find().sort({desc:1}).then(documents => {
    // console.log('documents:',documents)
    res.status(200).json(documents);
  })
});

router.get("/slowniki", (req, res, next) => {
  GrantDirectory.find().sort({desc:1}).then(documents => {
    // console.log('documents:',documents)
    res.status(200).json(documents);
  })
});

router.get("/kolumny", (req, res, next) => {
  Column.find().sort({order:1}).then(documents => {
    // console.log('documents:',documents)
    res.status(200).json(documents);
  })
});


module.exports = router;
