// Deze code is gemixt van Suus, Max en Rick, Registreer en login code is van Suus, Chatfunctie is van Max en de filter/lijst code van Rick.
// extentions koppelen & express initialiseren
const express = require('express');
const multer = require('multer');
const upload = multer({dest: 'static/upload/'});
const mongoose = require('mongoose');
const slug = require('slug');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const bcrypt = require('bcrypt');
const app = express();
const port = 8080;

let db,
    Gebruikers;

// Database connectie via .env
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient; // mongo database
const uri = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0-k4xl3.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(uri, function (err, client) {
  if (err) {
    throw err; //Error als er geen verbinding gemaakt kan worden met de client (MongoClient)
  }
  db = client.db(process.env.DB_NAME) //Als er wel verbinding is, dan juiste info naar databese sturen
  Gebruikers = db.collection(process.env.DB_COLLECTION);
  Gebruikers.createIndex({ email: 1 }, { unique: true });
});

// Code van Rick
// views koppelen en routes definiëren
app
    .set('view engine', 'ejs')
    .set('views', 'views')
    .use(express.static('./static'))
    .use('/list', list)
    .use('/cats', cat)
    .use('/negentien', negentien)
    .use('/vrouw', vrouw)
    .use('/man', man)
    .use('/reload', reload)
    .use(bodyParser.json())
    .use(express.urlencoded({ extended: false}))
    .use(bodyParser.urlencoded({extended: true}))
    .use(cookieParser())
    .use(session({
      resave: false,
      saveUninitialized: true,
      secret: 'secret',
      secure: true
    }));

// functies van pagina's, goede data in renderen
function list(req, res, next) {
  db.collection('persons').find().toArray(done)

  function done(err, persons) {
    if (err) {
      next(err)
    } else {
      res.render('list.ejs', {persons: persons, style: style.list})
    }
  }
}

function cat(req, res, next) {
  db.collection('persons').find({
    animal: 'Kat'   // haalt personen op die een kat als lievelingsdier hebben
  }).toArray(done)

  function done(err, persons) {
    if (err) {
      next(err)
    } else {
      res.render('list.ejs', {persons: persons, style: style.list})
      // render de goede data in de list pagina/template
    }
  }
}

function vrouw(req, res, next) {
  db.collection('persons').find({
    looking: 'Man'
  }).toArray(done)

  function done(err, persons) {
    if (err) {
      next(err)
    } else {
      res.render('list.ejs', {persons: persons, style: style.list})
    }
  }
}

function man(req, res, next) {
  db.collection('persons').find({
    looking: 'Vrouw'
  }).toArray(done)

  function done(err, persons) {
    if (err) {
      next(err)
    } else {
      res.render('list.ejs', {persons: persons, style: style.list})
    }
  }
}

function negentien(req, res, next) {
  db.collection('persons').find({
    birth: { $gt: new Date("1999-10-01T00:00:00.000Z")}
  }).toArray(done)

  function done(err, persons) {
    if (err) {
      next(err)
    } else {
      res.render('list.ejs', {persons: persons, style: style.list})
    }
  }
}

function reload(req, res) {
    db.collection('persons').findOne(
      { name: 'Desi' },
      (err, result) => {
        if (err) throw err;
        const id = result._id;

        refreshData(id, () => {
          res.redirect('/list');
        });
      });
}

function refreshData(id, callback) {
    let number = Math.random();
    if (number > 0.5) {
    db.collection('persons').updateOne(
      { _id: ObjectId(id) },
      { $set: { img: 'img/desitwo.jpg' } },
      (err, result) => {
        if (err) throw err;

        callback();
      });
    } else {
      db.collection('persons').updateOne(
        { _id: ObjectId(id) },
        { $set: { img: 'img/desi.jpg' } },
        (err, result) => {
          if (err) throw err;
  
          callback();
        });
    }
}

app
    .get('/', goHome)
    // Registration
    .get('/registration', registreren)
    .post('/registrating', gebruikerMaken)
    // Inloggen
    .post('/log-in', inloggen)
    // error404
    .get('/logout', uitloggen)


// Laat de registratiepagina zien
function registreren(req, res) {
    if (req.session.loggedIN) {
        res.render('profiel');
    } else {
        res.render('aanmelden');
    }
}

// Gaat naar home
function goHome(req, res) {
    if (req.session.loggedIN) {
        res.render('profiel');
    } else {
        res.render('inloggen');
    }
}
// Maakt de gebruiker aan op post

function gebruikerMaken(req, res) {
    let data = {
        'voornaam': req.body.voornaam,
        'achternaam': req.body.achternaam,
        'geboortedatum': req.body.geboortedatum,
        'hobby': req.body.hobby,
        'email': req.body.email,
        'wachtwoord': req.body.wachtwoord,
    };
    // Pusht de data + input naar database (gebruikers = collection('users'))
    Gebruikers
        .insertOne(data, function(err) {
            if (err) {
                res.render('aanmelden');
                console.log('Inloggen niet gelukt')
            } else {
                req.session.loggedIN = true;
                req.session.userId = data.email;
                req.session.userName = data.voornaam;
                res.render('profiel');
                console.log('Gebruiker toegevoegd');
            }
        });
}
// checkt of gebruiker bestaat en logt in door sessie aan te maken met de email als ID (omdat email uniek is)
// req.Flash('class voor de div', 'het bericht') geeft dat  error/succes bericht door naar de template en daar staat weer code die het omzet naar html
function inloggen(req, res) {
    Gebruikers
        .findOne({
            email: req.body.email
        })
        .then(data => {
            if (data) {
                if (data.wachtwoord === req.body.wachtwoord) {
                    req.session.loggedIN = true;
                    req.session.userId = data.email;
                    req.session.userName = data.voornaam;
                    res.render('profiel');
                    console.log('ingelogd als ' + req.session.userId);
                } else {
                    res.render('inloggen');
                    console.log('Wachtwoord is incorrect');
                }
            } else {
                res.render('inloggen');
                console.log('Account is niet gevonden');
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function uitloggen(req, res) {
    req.session.loggedIN = false;
    res.render('inloggen');
    console.log('U bent uitgelogd');
}


// kleine data objecten, voor 404 error & styles
const me = {
  name: 'Rick',
}

const style = {
list: 'style.css',
notfound: 'style.css'
}

// 404 page function
app.get('*', (req,res) => {
    res.status(404).render('not-found.ejs', {
      name: me.name,
    style: style.notfound});
});

// luisteren op poort
app.listen(port, () => console.log(`Example app listening on port ${port}!`));