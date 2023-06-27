const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require('path');
const Register = require("../models/Register");
const Global=require("../global")
const router = express.Router();


const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "application/pdf" : 'pdf',
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" :"docx",
  "application/msword" : 'doc'
};




function teraz(){
  const data=new Date();
  return `${data.getDate()}${data.getMonth()+1}${data.getFullYear()}_${data.getHours()}${data.getMinutes()}${data.getSeconds()}`;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    console.log('storage',req.params.id,teraz(),`${Global.getAttachmentURL()}/${req.params.id}`)
    if (isValid) {
      error = null;
      ensureExists( `${Global.getAttachmentURL()}/${req.params.id}`, { recursive: true,mode:0o744}, function(err) {
        if (err)console.log('err',err)
        else console.log("OK")
      });
    }
    cb(error, `${Global.getDownloadURL()}/${req.params.id}`);
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, path.parse(name).name + "-" + teraz() + "." + ext);
  }
});

function ensureExists(path, mask, cb) {

  if (typeof mask == 'function') { // Allow the `mask` parameter to be optional
      cb = mask;
      mask = 0o744;
  }
  fs.mkdir(path, mask, function(err) {
      if (err) {
          if (err.code == 'EEXIST') cb(null); // Ignore the error if the folder already exists
          else cb(err); // Something else went wrong
      } else cb(null); // Successfully created folder
  });
}

//*************    delete file *****************************/
router.put("/pliki/:id/:fileId/:fileName", (req, res, next) => {
  // const item=JSON.parse(req.body);
  // delete item['_id'];
  console.log('put /:id', req.params)
  Register.findByIdAndUpdate({ _id: req.params.id },{'$pull':{files:{_id:req.params.fileId}}}).then(data=>{
    console.log('put /pliki/:id/:fileId',data);
    const path = `${Global.getAttachmentURL()}/${req.params.id}/${req.params.fileName}`
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err)
      }
  //file removed
    })


    res.status(200).json(data)
  })
});


router.post("/pliki/:id",multer({ storage: storage }).array('file',10),(req, res, next) => {
  //  const item=JSON.parse(req.body);
  // let blobsDesc=
 // const item=req.body;

  const id=req.params.id || 1
  if (req.files) {
    Register.findByIdAndUpdate({ _id: req.params.id },
      {'$push':{files:{filename:req.files[0].filename,path:req.files[0].path}}}
        ,{new: true}
      )
      .then(data=>{
        const plik=data['files'].find(x=>x.filename==req.files[0].filename)
        console.log('pliki upload',data['files'],'plik:',plik)
      // console.log('put',data);
        res.status(200).json({filename:req.files[0].filename,path:req.files[0].path,_id:plik._id})
      })
      .catch(error => {
        console.log(`Error updating subscriber by ID: ${error.message}`);
        res.status(201).json(error);
       });
    }


});




// router.put("/:id",multer({ storage: storage }).array("files[]", 12) ,(req, res, next) => {
  router.put("/upload/:id",multer({ storage: storage }).array('blobs[]',10),(req, res, next) => {
    console.log('put /upload/:id')
    //  const item=JSON.parse(req.body);
    // let blobsDesc=
    const item=req.body;

    const files=req.files;
    if (req.files) {
      ensureExists(__dirname + `../assets/${req.params.id}`, 0o744, function(err) {
        if (err) ;
        else {
          const url = req.protocol + "://" + req.get("host")+'/assets';
      imagePath = url + "/images/" //+ req.files.filename
      console.log('imagePath',imagePath)
      if(typeof item['blobsDesc']!='undefined'){
        if(typeof item['files']=='undefined')item['files']=[]
        item['blobsDesc'].forEach((x,index)=>item['files'].push({filePath:url+req.files[index].filename,description:x,__v:null}))
      }
        }
      });

    }

    delete item['blobsDesc'];
    console.log('put insurance files',req.files);
    console.log('put insurance body',item);
    // Insurance.findByIdAndUpdate({ _id: req.params.id },item).then(data=>{
    //   // console.log('put',data);
    //   res.status(200).json(data)
    // })

});



router.post("", (req, res) => {
  console.log('body:',req.get('Content-Type'),req.body);
  const body=JSON.parse(req.body);
  delete body['_id'];

  const item = new Register(body);

  Register.findOne({ number_of_deal:body['number_of_deal']}).then(document => {
    console.log('document find:',document)
    if(document!=null){
      const err = new Error('something went wrong');
        res.status(500).json({
        blad:'error find',
      });
    }
    else{
       item.save().then(data => {
        res.status(201).json(data);
      })
      .catch(err => {
        res.status(500).json({
          blad:'error',
          error: err
        });
      });
    }
  // If you call `next()` with an argument, that argument is assumed to be
  // an error.
    // next(err);
    // res.status(200).json(document);
  })
  .catch(err => {
    res.status(500).json({
      blad:'error find 2',

  });
  });


  // item.save().then(data => {
  //   res.status(201).json(data);
  // })
  // .catch(err => {
  //   res.status(500).json({
  //     blad:'error',
  //     error: err
  //   });
  // });
});

router.delete("/:id", (req, res, next) => {
    Register.deleteOne({ _id: req.params.id }).then(result => {
      // console.log(result);
      const path=__dirname + `/../assets/${req.params.id}`
      fs.rm(__dirname + `/../assets/${req.params.id}`, { recursive: true },()=>console.log('delete done',path))
      res.status(200).json(result);
    });
});

router.put("/:id", (req, res, next) => {
    const item=JSON.parse(req.body);
    delete item['_id'];
console.log('put /:id')
    Register.findByIdAndUpdate({ _id: req.params.id },item).then(data=>{
      // console.log('put',data);
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(500).json(Global.resolveError(err));
    });
});




router.get("/download", (req, res, next) => {
  // const path=__dirname + `/../assets/${req.params.id}/${req.params.file}`
  const file=__dirname + `/../assets/${req.query.id}/${req.query.filename}`
  // console.log('download',req.query.filename,req.query.id,file)
  res.download(file,
  (err)=>{
    if(err)console.log('błąd',err);
  });
});



router.get("", (req, res, next) => {
  Register.find().sort({own_number_of_deal:1}).then(documents => {
    // console.log('documents:',documents)
    res.status(200).json(documents);
  })
});


router.post("/filtruj", (req, res) => {

  const body=JSON.parse(req.body);
  console.log('body:',req.get('Content-Type'),req.body,body);
  const pattern={date_of_deal_start:{ $gte: body['date_of_deal_start'] },date_of_deal_stop:{ $lte: body['date_of_deal_stop']},number_of_deal:{ $regex: body['number_of_deal'], $options: "i" }}
  const p={}

  Object.entries(body).forEach(([key,value])=>{
    const obj={}
    obj[`${key}`]=pattern[key]
    if(value)Object.assign(p,obj)
    // console.log('klucz,wartość',key,value,p)
   })

  console.log("wynik",p)


  Register.find(p).sort({date_of_deal_start:1}).exec((err, documents) => {
    if (err) return res.status(400).json(err);

    res.status(200).json(documents);
  });
});


router.post("/import/csv", (req, res) => {
  // console.log('body:',req.get('Content-Type'),req.body);
  const body=JSON.parse(req.body);
  delete body['_id'];

  const injEntityH =new Promise(function(resolve, reject) {
    resolve(getInjEntity(body))
  });
  const injInjectionTypeH =new Promise(function(resolve, reject) {
    resolve(getInjectionType(body))
  });
  Promise.all([injEntityH,injInjectionTypeH]).then(function(values) {
    console.log('fuelPrevious',values)
    updateInsertInjPerson(body,values)
  }).catch((err) => {console.log(err)});




  res.status(201).json(body);

});



module.exports = router;
