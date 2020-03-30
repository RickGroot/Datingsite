const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welkom pagina
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Het overzicht
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;

