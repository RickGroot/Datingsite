// Deze code is gemixt van Suus, Max en Rick, Registreer en login code is van Suus, Chatfunctie is van Max en de filter/lijst code van Rick.
// extentions koppelen & express initialiseren
const express = require('express');
const multer = require('multer');
const upload = multer({
  dest: 'static/upload/'
});
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const argon2 = require('argon2');
const app = express();
const port = 8080;

let db

// Database connectie via .env
const url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@cluster0-zuzwx.azure.mongodb.net/test?retryWrites=true&w=majority";
let ObjectId = require('mongodb').ObjectID;

mongo.MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log("err", err);
  }
  db = client.db(process.env.DB_NAME);

})


// Code van Rick
// views koppelen en routes definiëren
app
  .set('view engine', 'ejs')
  .set('views', 'views')
  .use(express.static('./static'))
  .use('/list', list)
  .use('/cats', cat)
  .use('/achttien', achttien)
  .use('/vrouw', vrouw)
  .use('/man', man)
  .use(bodyParser.json())
  .use(express.urlencoded({
    extended: false
  }))
  .use(bodyParser.urlencoded({
    extended: true
  }))
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
      res.render('list.ejs', {
        persons: persons,
        style: style.list
      })
    }
  }
}

function cat(req, res, next) {
  db.collection('persons').find({
    animal: 'Kat' // haalt personen op die een kat als lievelingsdier hebben
  }).toArray(done)

  function done(err, persons) {
    if (err) {
      next(err)
    } else {
      res.render('list.ejs', {
        persons: persons,
        style: style.list
      })
      // render de goede data in de list pagina/template
    }
  }
}

function vrouw(req, res, next) {
  db.collection('persons').find({
    geslacht: 'Vrouw'
  }).toArray(done)

  function done(err, persons) {
    if (err) {
      next(err)
    } else {
      res.render('list.ejs', {
        persons: persons,
        style: style.list
      })
    }
  }
}

function man(req, res, next) {
  db.collection('persons').find({
    geslacht: 'Man'
  }).toArray(done)

  function done(err, persons) {
    if (err) {
      next(err)
    } else {
      res.render('list.ejs', {
        persons: persons,
        style: style.list
      })
    }
  }
}

function achttien(req, res, next) {
  db.collection('persons').find({
    birth: {
      $gt: new Date("1998-10-01T00:00:00.000Z")
    }
  }).toArray(done)

  function done(err, persons) {
    if (err) {
      next(err)
    } else {
      res.render('list.ejs', {
        persons: persons,
        style: style.list
      })
    }
  }
}

//code van Susanne

//App.get: de server stuurt data naar de gebruiker

app.get('/', function (req, res) {
  res.redirect('/welkom')
});

app.get('/welkom', function (req, res) {
  res.render('welkom.ejs')
});

app.get('/aanmelden', registreren)

function registreren(req, res) {
  if (req.session.inloggen) {
    res.redirect('list');
  } else {
    res.render('aanmelden');
  }
}

app.get('/inloggen', login)

function login(req, res) {
  if (req.session.inloggen) {
    res.redirect('list');
  } else {
    res.render('inloggen');
  }
}

app.get('/uitloggen', uitloggen)

function uitloggen(req, res) {
  req.session.inloggen = false;
  res.render('welkom');
  console.log('Je bent uitgelogd');
}

//App.post: de gebruiker stuurt data naar de server

app.post('/aanmelden', upload.single('image'), addProfile);

async function addProfile(req, res) {
  const hash = await argon2.hash(req.body.wachtwoord);
  req.session.user = {
    naam: req.body.naam,
    email: req.body.email,
    wachtwoord: hash,
    geslacht: req.body.geslacht,
    dier: req.body.dier,
    gezocht: req.body.gezocht,
    geboortedatum: req.body.geboortedatum,
    hobby: req.body.hobby,
    image: req.file ? req.file.filename : null
  };
  db.collection('user').insertOne(req.session.user);
  console.log(req.session.user);
  res.redirect('list');
};

app.post('/inloggen', inloggen)

function inloggen(req, res) {
  var wachtwoord = req.body.wachtwoord;

  db.collection('user').findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      throw err;
    } else if (user) {
      argon2.verify(user.wachtwoord, wachtwoord).then(check);

      function check(same) {
        if (same) {
          res.redirect('list');
        } else {
          res.render('inloggen-wachtwoord-error');
          console.log('Wachtwoord matcht niet met emailadres');
        }
      }
    } else {
      res.render('login-error');
      console.log('Account is niet gevonden');
    }
  });
}


//code Rick
// kleine data objecten, voor 404 error & styles
const me = {
  name: 'Rick',
}

const style = {
  list: 'style.css',
  notfound: 'style.css'
}

// 404 page function
app.get('*', (req, res) => {
  res.status(404).render('not-found.ejs', {
    name: me.name,
    style: style.notfound
  });
});

// luisteren op poort
app.listen(port, () => console.log(`Example app listening on port ${port}!`));