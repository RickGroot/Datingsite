// Deze code is gemixt van Max en Rick, login code is van Max en de filter/lijst code van Rick.
// extentions koppelen & express initialiseren
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const slug = require('slug');
const session = require('express-session');
const bodyParser = require('body-parser');

// Code van Rick
// MongoDB koppelen, de database geeft toegang aan alle IP's
const mongo = require('mongodb');
require('dotenv').config();
const url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@cluster0-zuzwx.azure.mongodb.net/test?retryWrites=true&w=majority";
let ObjectId = require('mongodb').ObjectID;
let db = null;

// Code van Rick en Max gemengd
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
      res.render('pages/list.ejs', {persons: persons, style: style.list})
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
      res.render('pages/list.ejs', {persons: persons, style: style.list})
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
      res.render('pages/list.ejs', {persons: persons, style: style.list})
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
      res.render('pages/list.ejs', {persons: persons, style: style.list})
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
      res.render('pages/list.ejs', {persons: persons, style: style.list})
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

// kleine data objecten, voor 404 error & styles
const me = {
    name: 'Rick',
}

const style = {
  list: '/style.css',
  quiz: '/quiz.css',
  profile: '/profile.css',
  notfound: '/notfound.css'
}

// 404 page function
app.get('*', (req,res) => {
    res.status(404).render('pages/not-found.ejs', {
      name: me.name,
    style: style.notfound});
});

// luisteren op poort
app.listen(port, () => console.log(`Example app listening on port ${port}!`));