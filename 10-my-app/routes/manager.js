const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const hash = require('pbkdf2-password')();

const url = 'mongodb://localhost:27017/helle-mongo';

const findDocuments = (client, callback) => {
  let db = client.db("helle-mongo");  
  let collection = db.collection('helle-mongo-manager');
  collection.find({}).toArray((error, docs) => {
    if (error) return process.exit(1);

    console.log(`Found the following documents:`);
    //console.dir(docs);
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


exports.addManager = (req, res, next) => {
  let bindError = '',
    manager = req.body;
  if(req.body.password !== req.body.repassword){
    bindError = '两次密码输入不一样';
    res.render('manager/signup', { title: 'Sign up error',bindError,manager });
  }else{
    let newAccount = {};
    newAccount.name = req.body.name;
    newAccount.password = req.body.password;
    newAccount.id = parseInt(Math.random()*1000000000).toString();
    hash({ password: req.body.password }, (err, pass, salt, hash)=> {
      if (err) throw err;

      newAccount.salt = salt;
      newAccount.hash = hash;
    });

    MongoClient.connect(url,(err,client)=>{
      if (err) return process.exit(1);
      console.log('Connection is okey');
      insertDocuments(client,newAccount,(result)=>{
        console.log(result);
        res.redirect(303,'/');
      });
    });
  }
};

const findUser = (name,pass,docs)=>{
  return docs.find((item)=>{
    return item.name === name && item.password === pass;
  });
};

const authenticate = (name, pass, fn)=>{
  MongoClient.connect(url,(err,client)=>{
    if (err) return process.exit(1);
    console.log('Connection is okey');
    findDocuments(client,(docs)=>{
      let user = findUser(name, pass,docs);
      if (!user) return fn(new Error('cannot find user'));

      hash({ password: pass, salt: user.salt },(err, pass, salt, hash)=> {
        if (err) return fn(err);
        if (hash === user.hash) return fn(null, user);
        fn(new Error('invalid password'));
      });
    });
  });
};

exports.authUser = (req, res, next) => {

  authenticate(req.body.name, req.body.password, (err, user)=>{
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(()=>{
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/">/restricted</a>.';
        res.redirect('back');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.';
      res.redirect('/signin');
    }
  });


  /* let bindError = '';
  if(req.body.password !== req.body.repassword){
    bindError = '两次密码输入不一样';
    res.render('manager/signup', { title: 'Sign up error',bindError,manager });
  }else{
    let newAccount = {};
    newAccount.name = req.body.name;
    newAccount.password = req.body.password;
    newAccount.id = parseInt(Math.random()*1000000000).toString();
    hash({ password: req.body.password }, (err, pass, salt, hash)=> {
      if (err) throw err;

      newAccount.salt = salt;
      newAccount.hash = hash;
    });

    MongoClient.connect(url,(err,client)=>{
      if (err) return process.exit(1);
      console.log('Connection is okey');
      insertDocuments(client,newAccount,(result)=>{
        console.log(result);
        res.redirect(303,'/');
      });
    });
  } */
};

exports.signup = (req, res)=>{
  let bindError = '';
  let manager = {
    name: ''
  };
  res.render('manager/signup', { title: 'Sign up',bindError,manager});
};

exports.signin = (req, res)=>{
  let bindError = '';
  res.render('manager/signin', { title: 'Sign in',bindError});
};