const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const hash = require('pbkdf2-password')();

const url = 'mongodb://localhost:27017/helle-mongo';

const findDocuments = (client, callback) => {
  let db = client.db("helle-mongo");  
  let collection = db.collection('helle-mongo-manager');
  collection.find({}).toArray((error, docs) => {
    if (error) return process.exit(1);

    console.log(`Found the following documents:`)
    console.dir(docs);
    callback(docs);
  });
};

const insertDocuments = (client,data,callback) =>{
  let db = client.db("helle-mongo");  
  const collection = db.collection('helle-mongo-manager');

  collection.insert(data,(err,result)=>{
    if(err) return process.exit(1);
    console.log(result);
    callback(result);
  });
};

MongoClient.connect(url,(err,client)=>{
  if (err) return process.exit(1);
  console.log('Connection is okey');
  findDocuments(client,()=>{

  });
});

exports.addManager = (req, res, next) => {
  let bindError = {};
  if(req.body.password !== req.body.repassword){
    bindError.passErr = '两次密码输入不一样';
    res.render('manager/signup', { title: 'Add Manager Error' });
  }else{
    let newAccount = req.body;
    newAccount.id = parseInt(Math.random()*1000000000).toString();
    hash({ password: req.body.password }, function (err, pass, salt, hash) {
      if (err) throw err;

      newAccount.salt = salt;
      newAccount.hash = hash;
    });

    MongoClient.connect(url,(err,client)=>{
      if (err) return process.exit(1);
      console.log('Connection is okey');
      insertDocuments(client,newAccount,(result)=>{
        console.log(result);
        res.send(result);
      });
    });

    //res.redirect(303,'/list');//重定向到list页
  }
};

exports.signup = (req, res)=>{
  res.render('manager/signup', { title: 'Add Manager' });
};