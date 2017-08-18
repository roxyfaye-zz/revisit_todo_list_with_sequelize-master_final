const express = require('express');
const mustache = require('mustache');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const models = require('./models');
const sequelize = require('sequelize');
const moment = require('moment');
moment().format();

const application = express();
application.engine('mustache', mustacheExpress());

application.set('view engine', 'mustache');
application.set('views','./views');
application.use(expressValidator())
application.use(bodyParser.json());
application.use(express.static('views'));
application.use(bodyParser.urlencoded({
    extended: true
}));

var todos = [];

application.get('/', (request, response)=>{ 
      models.todos.findAll()
        .then(result => {
            console.log(result)
          var listItem = {
            todos: result
          }
          response.render('index', listItem)
        })
    }   
);

application.post('/', (request, response) => {
  var title = request.body.title;
  console.log(title)
  request.checkBody('title', ' Add your todo').notEmpty();
  var errors = request.validationErrors();
              if(errors){
                response.render('index',{todos, errors});
              }
              
              else {
                var todo = {};
                todo.title = title;
                todo.complete = false;
                models.todos.create(todo)
                .then(result =>response.redirect('/'));
              }
});

 application.post('/:id', (request, response)=> {
  models.todos.update({
    complete: true
    },{
    where: {
        id: request.params.id,
      }
   }).then(result=> response.redirect('/')); 

 })


const port = 3000
application.listen(port, function () {
    console.log("server is running!");
    console.log('listening at port: ', port);
});
