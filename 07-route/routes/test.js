const about = (req, res)=> {
  res.send('about');
};

const abcd = (req, res)=> {
  res.send('ab?cd');
};

const fly = (req, res)=> {
  res.send('/.*fly$/');
};

const cb0 = (req, res, next)=> {
  console.log('CB0');
  next();
};

const cb1 = (req, res, next)=> {
  console.log('CB1');
  next();
};

const getBook = (req, res)=> {
  console.log('Get a book');
  res.send('Get a book');
};

const postBook = (req, res)=> {
  console.log('Add a book');
  res.send('Add a book');
};

const putBook = (req, res)=> {
  console.log('Update the book');
  res.send('Update the book');
};

const getSpecials = (req, res, next)=>{
  res.locals.specials = {title:'special',items:[{item:'shoes',discount:'70% off'},{item:'T-shirt',discount:'50% off'}]};
  next();
};

const renderSpecials = (req, res, next)=>{
  res.render('special');
};

module.exports = {about,abcd,fly,cb0,cb1,getBook,postBook,putBook,getSpecials,renderSpecials};