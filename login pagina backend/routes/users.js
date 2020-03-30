const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// User variabele inladen
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login pagina
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// registreren Pagina
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Registreren controle
router.post('/register', (req, res) => {
  const { name, email, password, date, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Vul alle velden in' });
  }
  //check of alle vulden ingevuld zijn

  if (password != password2) {
    errors.push({ msg: 'Wachtwoorden komen niet overeen' });
  }
  //check of wachtwoorden gelijk zijn

  if (password.length < 6) {
    errors.push({ msg: 'Wachtwoord moet minimaal 6 tekens bevatten' });
  }
  //check of wachtwoord meer dan 6 tekens heeft

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'De Email bestaat al' });
        res.render('register', {
          errors,
          name,
          email,
          date,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          date
        });
        //variabele meegeven aan nieuwe gebruiker

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Je bent geregistreerd en kan nu inloggen'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// inloggen
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// uitloggen
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Je bent uitgelogd');
  res.redirect('/users/login');
});

module.exports = router;
