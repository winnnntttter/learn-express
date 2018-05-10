const express = require('express');
const router = express.Router();
const site = require('./site');
const post = require('./post');
const user = require('./user');
// General

router.get('/', site.index);

// User

router.get('/users', user.list);
router.all('/user/:id/:op?', user.load);
router.get('/user/:id', user.view);
router.get('/user/:id/view', user.view);
router.get('/user/:id/edit', user.edit);
router.put('/user/:id/edit', user.update);

// Posts

router.get('/posts', post.list);


module.exports = router;