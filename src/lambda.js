const server = require('restana')()
const files = require('serve-static')
const path = require('path')
const AWSXRay = require('aws-xray-sdk')

AWSXRay.enableAutomaticMode()

// const app = require('next')({
//   dev: false,
//   dir: path.join(__dirname, '../build/_next/standalone'),
//   conf: {
//     distDir: '.next',
//   },
// })]

const app = require('next')({
  dev: false,
  dir: path.join(__dirname, '..'),
  conf: {
    distDir: 'build/_next/standalone/build/_next',
  },
})

let isReady = false
let nextRequestHandler

async function init() {
  if (!isReady) {
    await app.prepare()
    nextRequestHandler = app.getRequestHandler()
    isReady = true
  }
}

server.use(AWSXRay.express.openSegment('NextJSApp'))

server.use(
  '/_next/static',
  files(path.join(__dirname, '../build/_next/static'))
)
server.use(files(path.join(__dirname, '../public')))

server.all('*', async (req, res) => {
  await init()
  return nextRequestHandler(req, res)
})

server.use(AWSXRay.express.closeSegment())

module.exports.handler = require('serverless-http')(server)
