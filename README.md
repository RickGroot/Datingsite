c16f6a90d5e2.png">
Hallo allemaal! Wij zijn Max, Rick en Susanne en studeren Communicatie en multimedia design aan de HvA (2e jaars). Voor project Tech is het de bedoeling dat wij als team een datingapp/website maken, deze hebben wij gedocumenteerd in deze repository. 

## Link
Link is een datingapp voor jong en oud. Je kunt je gemakkelijk registreren, of natuurlijk inloggen als je al een account hebt. Wanneer je dat gedaan hebt, kom je op de overzichtspagina terecht, met allemaal potentiele matches. Om jouw potentiele match snel te vinden, kun je bovenaan de pagina filteren, zo kun je bijvoorbeeld aangeven dat hij/zij ouder dan 19 moet zijn. Als je dan een potentiele match hebt gevonden, klik je op deze persoon en kom je op zijn/haar account. Hier kun je gemakkelijk de persoon een berichtje sturen, door op het chaticoon te klikken. Veel date plezier!

** afbeeldingen van prototype **

## Project installeren
1. clone de repository (in de terminal) door rechtboven aan de pagina op de groene knop te klikken: 
```
$ git clone -b develop https://github.com/Rickert41/Datingsite.git
```
2. Vraag aan ons het .env bestand;

3. Installer de node_modules (in de terminal):
```
$ npm install
```
4. Run de app (in de terminal):
```
$ node index.js
```
5. Open in de browser: http://localhost:8080/


## Aanpak
Als team hebben wij dagelijks contact via Slack, om te overleggen wie welke issue oppakt, maar ook als iemand er niet helemaal uitkomt of om aan te geven dat iemand klaar is met zijn werk op dat moment en een pull request gaat aanmaken. 

We werken op basis van de issues, daar kijken we wat er nog gedaan moet worden en hier maken we een aparte branch voor aan. Wanneer deze branch klaar is, en je dus een issue hebt afgerond, doen we een pull request naar de develop branch. We zetten dan tenminste 1 ander teamlid als code review. Als hij/zij (of hun) het goed gekeurd heeft, mergen we de branch naar de develop branch.

Op deze manier houden we allemaal controle over wat er gedaan is en wat er nog gedaan moet worden. Verder houden we goed contact en doen we dit project dus echt samen.

## Database
Alle data die binnenkomt van de gebruiker, wordt opgeslagen in een database. Hierdoor kan de gebruiker bijvoorbeeld inloggen, omdat de data van het registreren is opgeslagen. Wij hebben ervoor gekozen om Mongodb als database te nemen, omdat wij tijdens de lessen van Backend er al mee bezig zijn geweest. 

** afbeelding (screenshot) database **

## Bronnen
 1. Github, Cmda-bt. (z.d.). Geraadpleegd op 10 februari, van https://github.com/cmda-bt/be-course-19-20;
 2. Express - Node.js web application framework. (z.d.). Geraadpleegd op 12 maart 2020, van https://expressjs.com;
 3. Introduction to Node.js. (z.d.). Geraadpleegd op 23 februari 2020, van https://nodejs.dev/;
 4. Managed MongoDB Hosting | Database-as-a-Service. (z.d.). Geraadpleegd op 12 maart 2020, van https://www.mongodb.com/cloud/atlas;
 5. Embedded JavaScript templating. (z.d.). Geraadpleegd op 5 maart 2020, van https://ejs.co/;
 6. FreeCodeCamp.org. (z.d.). Geraadpleegd op 23 februari 2020, van https://www.freecodecamp.org;
 7. You don't need passport.js - Guide to node.js authentication. (31 mei 2019). Geraadpleegd op 6 april, van: https://softwareontheroad.com/nodejs-jwt-authentication-oauth/;
 
 
