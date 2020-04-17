const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ status: 'Welcome' });
});

const auth = require('./auth');
router.use('/auth', auth);

const company = require('./retrieve');
router.use('/retrieve', company);

module.exports = router;
