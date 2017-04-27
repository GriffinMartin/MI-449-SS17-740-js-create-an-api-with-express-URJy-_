var express = require('express')
var todos = require('./todos.js')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var port = process.env.PORT || 8080

app.get('/', function (request, response) {
  response.json({
    welcome: 'welcome to my todo API!' 
  })
})

// Route to view all todos at once
app.get('/todos', function (request, response) {
  response.json(todos)
})

// Route with parameter to different todos
app.get('/todos/:slug', function (request, response) {
  if (!todos[request.params.slug]) {
    response.status(404).end('sorry, no such todos: ' + request.params.slug)
    return
  }
  response.json(todos[request.params.slug])
})

// Saves information into todos
app.post('/todos', function (request, response) {
  var slug = request.body.todo.trim().toLowerCase().split(' ').join('-')
  todos[slug] = {
		todo: request.body.todo.trim(),
		status: request.body.status
	}
  response.redirect('/todos/' + slug)
})

// Delete todo
app.delete('/todos/:slug', function (request, response) {
  delete todos[request.params.slug]
  response.redirect('/todos')
})

// Update todo
app.put('/todos/:slug', function (request, response) {
  var todo = todos[request.params.slug]
  if (request.body.todo !== undefined) {
    todo.todo = request.body.todo.trim()
  }
  if (request.body.status !== undefined) {
    todo.status = request.body.status
  }
  response.redirect('/todos')
})

// Status code for invalid url
app.use(function (request, response, next) {
  response.status(404).end(request.url + ' not found')
})

app.listen(port)