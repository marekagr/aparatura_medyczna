const getAttachmentURL = () => {
  return __dirname + `/assets`; //windows
  //return __dirname + `/../assets` //linux
};
exports.getDownloadURL = () => {
  //  return 'backend/assets';
  return __dirname + `/assets`
};

exports.resolveError=(blad)=>{
  let msg=''
  const translate=[{number_of_deal:'numer umowy'}]

  switch(blad['code']){
    case 11000: //DuplicateKey
      for(const[key,value] of Object.entries(blad['keyValue'])){
          msg=`Błąd!!! ${key} : ${value} już istnieje`
      }
      break
  }
  translate.forEach(item=>{
    for (const [key, value] of Object.entries(item)) {
      // console.log(`${key}: ${value} ${msg}`,key,value);
      msg=msg.replace(key,value)
      // console.log(`${key}: ${value} ${msg}`);
    }
  })
  
  return msg
}

exports.getAttachmentURL = getAttachmentURL;
