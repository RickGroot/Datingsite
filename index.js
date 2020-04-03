// Deze code is gemixt van Suus, Max en Rick, Registreer en login code is van Suus, Chatfunctie is van Max en de filter/lijst code van Rick.
// extentions koppelen & express initialiseren
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const upload = multer({dest: 'static/upload/'});
const mongoose = require('mongoose');
const slug = require('slug');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
require('dotenv').config();
const app = express();
const port = 8080;

// Code van Rick
// MongoDB koppelen, de database geeft toegang aan alle IP's
const url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@cluster0-zuzwx.azure.mongodb.net/test?retryWrites=true&w=majority";
let ObjectId = require('mongodb').ObjectID;
let db = null;


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
    .use(bodyParser.urlencoded({extended: true}))
    .use(expressLayouts)
    .use(session({
      resave: false,
      saveUninitialized: true,
      secret: 'secret'
    }));

// Vanaf hier code van Rick
// goede database ophalen
mongo.MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log("err", err);
  }
  db = client.db(process.env.DB_NAME);
})


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

// Vanaf hier code van Susanne
app.get('/', function(req, res){
  res.redirect('/welkom')
});

app.get('/welkom', (req, res) => {
res.render('welkom.ejs')
});

app.get('/aanmelden', (req, res) => {
  res.render('aanmelden.ejs')
});

app.get('/inloggen', (req, res) => {
  res.render('inloggen.ejs')
});

app.get('/profiel-inloggen.ejs', (req, res) => {
  res.render('profiel-inloggen.ejs', req.session.profile)
});

app.get('/profiel', (req, res) => {
  res.render('profiel.ejs', req.session.user)
});


app.post('/aanmelden', upload.single('image'), addProfile); //Bij 'aanmelden.ejs', upload de single image (1 toegestaan) van de functie addProfile en zet het in mapje voor geuploade files

function addProfile(req, res){ //Functie met request(verzoek), response(reactie)
    req.session.user = { //Onderstaande gegevens in req.session.user zetten
        username: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        gender: req.body.gender,
        birthday: req.body.birthday,
        search: req.body.search,
        image: req.file ? req.file.filename : null
      };
  db.collection('datingapp-users').insertOne(req.session.user); //Alle info die bij req.session.user hoort, naar database 'datingapp-users' sturen
  console.log(req.session.user); //Terminal laat alle gegevens van req.session.user zien
  res.redirect('profiel'); //Route naar volgende pagina
};

app.post('/inloggen', login);

function login(req, res){ 
  req.session.profile = { 
      username: req.body.userName,
      password: req.body.password,
    };
db.collection('datingapp-users').insertOne(req.session.profile);
console.log(req.session.profile);
res.redirect('profiel-inloggen.ejs'); 
};

// kleine data objecten, voor 404 error & styles
const me = {
  name: 'Rick',
}

const style = {
list: '/css/style.css',
notfound: '/css/style.css'
}

// 404 page function
app.get('*', (req,res) => {
    res.status(404).render('not-found.ejs', {
      name: me.name,
    style: style.notfound});
});

// luisteren op poort
app.listen(port, () => console.log(`Example app listening on port ${port}!`));