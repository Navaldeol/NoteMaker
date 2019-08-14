
const express = require('express');
const app = express();
var bodyParser  = require('body-parser');
var cors        = require('cors');
var mongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectId
var noteRepo = require('./NoteRepository.js');
var noteRouter =require('./noteRouter.js');
var router     = express.Router;
var morgan     = require('morgan')
var react      = require('react');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use((cors));
app.use(morgan('combined'));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//Database Login
const CONNECTION_STRING = process.env.DATABASE; 
mongoClient.connect(CONNECTION_STRING, { "useNewUrlParser": true },  (err, client) => {
  if(err) {
       console.log('Database error: ' + err);
    }else {
      console.log('Successful database connection')
   }
  var db = client.db("issueDB");
  noteRepo(app , db)
  
//  noteRouter(app, db)
  
  
 //Error 404 Message 
    app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});
})
//Launch our backend server
app.use('/api',noteRouter(process.env.PORT))
// listen for requests :)
app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + process.env.PORT);
});
