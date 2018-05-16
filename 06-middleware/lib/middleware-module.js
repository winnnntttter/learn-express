
const middleware1 = (req,res,next)=>{
  req.test = {a:"aaa"};
  console.log(req.test);
  next();
};

const middleware2 = (req,res,next)=>{
  var test = req.test;
  test.b = "fff";
  console.log(req.test);
  next();
};

const middleware3 = (req,res,next)=>{
  console.log(req.test);
  next();
};

const checkUser = (req,res,next)=>{
  if(req.query.api_key){
    next();
  }else{
    res.status(401).send('Not authorized');
  }
};

module.exports = {middleware1,middleware2,middleware3,checkUser};