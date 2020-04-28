const express = require('express')
const cors = require('cors')

const createError = require('http-errors')
const path = require('path')

const app = express()
const indexRoute = require('./routes')

const { ExpressPeerServer } = require('peer')

require('dotenv').config()

app.use(express.json())        // support JSON-encoded bodies
app.use(express.urlencoded({     // support URL-encoded bodies
  extended: true
}))

app.use(cors())
app.use('/', indexRoute)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('hellow from the other side')
})

var server = app.listen(9000, () => {
  console.log("Server listening on port 9000")
})

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/'
})

app.use('/', peerServer);

peerServer.on('connection', client => {
  console.log('New connection to server. Client ID: ' + client.id)
})

peerServer.on('disconnect', (client) => {
  console.log(client.id + ' disconnected.')
});

peerServer.on('error', error => {
  console.log(error)
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app