const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const GrantMenu = require("../models/GrantMenu");
const GrantDirectory = require("../models/GrantDirectory");
const Column = require("../models/Column");

const router = express.Router();


router.get("", (req, res, next) => {
  User.find().populate({path:'grantMenu.grantMenuId'}).populate({path:'grantDirectory.grantDirectoryId'}).then(documents => {
    //  console.log('documents:',documents)
    res.status(200).json(documents);
});
});

router.post("/dodaj", (req, res, next) => {

  const body=JSON.parse(req.body);
  bcrypt.hash(body.password, 10).then(hash => {
    const user = new User({
      user: body.user,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.put("/:id", (req, res, next) => {
  const user=JSON.parse(req.body);
  console.log('put user',user);
  User.findByIdAndUpdate({ _id: req.params.id },user,{new:true}).then(data=>{
    // console.log('put',data);
    res.status(200).json(data)
  })
  // res.status(200).json(user)
});

router.put("/zmiana-hasla/:id", (req, res, next) => {
  const data=JSON.parse(req.body);
  console.log('put zmiana hasła',data);
  bcrypt.hash(data['password'],4,(err,hash)=>{
    data['password']=hash
    console.log(data,hash)
    User.findByIdAndUpdate({ _id: req.params.id },data).then(data=>{
        // console.log('put',data);
        res.status(200).json(data)
      })
  })

  // User.findByIdAndUpdate({ _id: req.params.id },user).then(data=>{
  //   // console.log('put',data);
  //   res.status(200).json(data)
  // })
});




router.post("/login", (req, res, next) => {
  let fetchedUser;
  console.log(req.body)
  const body=req.body;
  User.findOne({ user: body.user }).populate({path:'grantMenu.grantMenuId'} ).populate({path:'grantDirectory.grantDirectoryId'}).populate({path:'column.columnId'})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Nieprawidłowy użytkownik lub hasło !"
        });
      }
      fetchedUser = user;
      console.log('fetchedUser',fetchedUser)
      return bcrypt.compare(body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Nieprawidłowy użytkownik lub hasło"
        });
      }
      const token = jwt.sign(
        { user: fetchedUser.user, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "8h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 28800,
        user: {user:fetchedUser.user,_id:fetchedUser._id,grantMenu:fetchedUser.grantMenu,grantDirectory:fetchedUser.grantDirectory,column:fetchedUser.column},

      });
    })
    .catch(err => {
      console.log(err)
      return res.status(401).json({
        message: `Błąd - nieprawidłowy użytkownik lub hasło`
      });
    });
});

router.get("/:id", (req, res, next) => {
 
User.findOne({ _id: req.params.id }).populate({path:'grantMenu.grantMenuId'} ).populate({path:'grantDirectory.grantDirectoryId'}).populate({path:'column.columnId'})
.then(user => {
  if (!user) {
    return res.status(401).json({
      message: "Nieprawidłowy użytkownik lub hasło !"
    });
  }
  fetchedUser = user;
  console.log('fetchedUser',fetchedUser)
  const token = jwt.sign(
    { user: fetchedUser.user, userId: fetchedUser._id },
    "secret_this_should_be_longer",
    { expiresIn: "8h" }
  );
  res.status(200).json({
    token: token,
    expiresIn: 28800,
    user: {user:fetchedUser.user,_id:fetchedUser._id,grantMenu:fetchedUser.grantMenu,grantDirectory:fetchedUser.grantDirectory,column:fetchedUser.column},

  });
})
.catch(err => {
  console.log(err)
  return res.status(401).json({
    message: `Błąd - nieprawidłowy użytkownik lub hasło`
  });
});


});

module.exports = router;
