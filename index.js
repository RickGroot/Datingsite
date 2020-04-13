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
const http = require('http').createServer(app);
const io = require('socket.io')(http);

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
  .use('/matches', match)
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
        persons: persons
      })
    }
  }
}

function match(req, res, next) {
  db.collection('matches').find().toArray(done)

  function done(err, matches) {
    if (err) {
      next(err)
    } else {
      res.render('matches.ejs', {
        matches: matches
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
        persons: persons
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
        persons: persons
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
        persons: persons
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
        persons: persons
      })
    }
  }
}

//code van Susanne

//App.get: de server stuurt data naar de gebruiker

app.get('/', function (req, res) {
  res.redirect('/welkom')
});

app.get('/welkom', checkwelkom, function (req, res) {
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

app.post('/aanmelden', upload.single('image'), creeerGebruiker)

async function creeerGebruiker(req, res) {
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
  db.collection('user')
    .insertOne(req.session.user, function (err) {
      if (err) {
        res.render('aanmelden');
        console.log('Registreren is niet gelukt')
      } else {
        req.session.inloggen = true;
        res.redirect('list');
        console.log('Je hebt een account gemaakt');
        console.log(req.session.user);
      }
    });
}

app.post('/inloggen', inloggen)


function inloggen(req, res) {
  var wachtwoord = req.body.wachtwoord;

  db.collection('user')
    .findOne({
      email: req.body.email
    }, function (err, user) {
    if (err) {
      throw err;
    } else if (user) {
      req.session.inloggen = true;
      argon2.verify(user.wachtwoord, wachtwoord).then(
        function check(same){
        if (same) {
          req.session.user = {
            email: user.email,
            naam: user.naam,
            geslacht: user.geslacht,
            dier: user.dier,
            gezocht: user.gezocht,
            geboortedatum: user.geboortedatum,
            hobby: user.hobby,
            image: user.image
          };
        res.redirect('list');
        req.session.inloggen = true;
        console.log('Je bent ingelogd');
        } else {
          res.status(404).send('Wachtwoord is incorrect');
          console.log('Wachtwoord is incorrect');
         
        }
      }
      )} else {
      res.status(404).send('account niet gevonden');
      console.log('Account niet gevonden');
     
      }
  });
    }

  app.get('/chat', checkchat, function(req, res) {
      res.render('chat.ejs');
  });


io.on("connection", function(socket){
    console.log('Iemand is aan het chatten:', socket.id);

    socket.on("chat", function(data){
        io.sockets.emit('chat', data );

   
    });

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data)
    });
});


    app.get('/profiel', checkprofiel)


    function checkprofiel(req,res){
      if (req.session.inloggen) {
        res.render('profiel.ejs', {user: req.session.user})
      } else {
        res.redirect('inloggen');
      }
    }

    function checkchat(req,res){
      if (req.session.inloggen) {
        res.render('chat.ejs')
      } else {
        res.redirect('inloggen');
      }
    }

    function checkwelkom(req, res) {
      if (req.session.inloggen) {
        res.redirect('list');
      } else {
        res.render('welkom');
      }
    }

//code Rick
// 404 page function
app.get('*', (req, res) => {
  res.status(404).render('not-found.ejs');
});

// luisteren op poort/glitch
const port = process.env.PORT || 8080;
const server = http.listen(port, function() {
  console.log('Server gestart op poort ' + port);
});