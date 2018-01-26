
const middleware1 = (req,res,next)=>{
  req.test = {a:"asd"};
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

module.exports = {middleware1,middleware2,middleware3};