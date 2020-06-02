const express = require('express')
const bodyParser = require("body-parser");

var cors = require('cors')
var Odoo = require("odoo-xmlrpc");
// var router = express.Router();


const app = express();
var session = require('express-session');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(session({
  secret: 'jaredasch',
  cookie: { maxAge: 60 * 60 * 1000 },
  saveUninitialized: false,
  resave: false
}))


app.get('/login//:port/:database/:username/:password/', function(req, res){
  var name = req.params.username
  var pass = req.params.password
  var database = req.params.database
  var port = req.params.port
  var odoo = new Odoo({
    url: "http://207.154.195.214",
    port: port,
    db: database,
    username: name,
    password: pass
  });
  odoo.connect(function(err, result) {
      if (err) {
        return res.send(err);
      }
      
      res.status(200).send((result).toString());
    });
});

app.get('/get_session/', function(req, res){
  var session_id = {sessionID: req.sessionID.toString()}
  // console.log(session_id)
  res.status(200).send(session_id); 
});




app.post('/call_method/:port/:database/:username/:password/:modelname/:method', function(req, res){
  var name = req.params.username
  var pass = req.params.password
  var modelname = req.params.modelname
  var method =  req.params.method
  var params = req.body.paramlist
  var database = req.params.database
  var port = req.params.port
  var odoo = new Odoo({
    url: "http://207.154.195.214",
    port: port,
    db: database,
    username: name,
    password: pass
  });
  
  var new_params = JSON.parse(params);
  var result_data = Object.values(new_params.paramlist);
  
  odoo.connect(function (err, val) {
    if (err) { return console.log(err); }
    console.log(val);

    odoo.execute_kw(modelname, method, [result_data], function (err, value) {
      if (err) { return res.send(err); }
      res.json(value)

      console.log(value)
    });
  });
});

app.listen(4000, () => {
    console.log('Express Server Started At Port: 4000')
})