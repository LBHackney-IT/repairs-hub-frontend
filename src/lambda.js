const server = require('restana')()
const files = require('serve-static')
const path = require('path')
const AWSXRay = require('aws-xray-sdk')

AWSXRay.enableAutomaticMode()

const app = require('next')({
  dev: false,
  dir: path.join(__dirname, '..'),
})

const nextRequestHandler = app.getRequestHandler()

server.use(AWSXRay.express.openSegment('NextJSApp')) // Open segment for tracing

server.use(files(path.join(__dirname, 'build')))
server.use(files(path.join(__dirname, 'public')))

server.all('*', (req, res) => nextRequestHandler(req, res))

server.use(AWSXRay.express.closeSegment()) // Close segment

module.exports.handler = require('serverless-http')(server)
