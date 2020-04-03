//Hiermee geef je aan dat je deze NPM packages wilt gebruiken en dat je op port 3000 zit.
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const upload = multer({dest: 'static/upload/'});
const mongo = require('mongodb');
const bodyParser = require("body-parser");
const slug = require("slug");
require('dotenv').config();
const app = express();
const port = 3000;

//Hiermee registreer je de NPM packages en geef je ze een route mee van waar ze te vinden zijn.
app.use('/static', express.static(__dirname+'/static')); 
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'secret'
  }));

//Dit gaat over de databese MongoDB
let db;
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0-k4xl3.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(uri, function (err, client){
  if (err) {
    throw err;
  }
  db = client.db(process.env.DB_NAME)
});

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

app.get('*', (req, res) => res.send('404 error not found')) // Als je op een route komt die niet gedefinieerd is, laat hij een error zien

app.listen(3000, () => console.log(`Dating app listening on port 3000!`));

