const server = require('restana')()
const files = require('serve-static')
const path = require('path')
// const AWSXRay = require('aws-xray-sdk')

// AWSXRay.enableAutomaticMode()

const standaloneDir = path.join(__dirname, '../build/_next/standalone')
const Next = require(path.join(standaloneDir, 'node_modules/next'))

const { config } = require(path.join(
  standaloneDir,
  'build/_next/required-server-files.json'
))
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config)

const app = Next({
  dev: false,
  dir: standaloneDir,
  conf: config,
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

server.use((req, res, next) => {
  console.log('=== REQUEST ===')
  console.log('URL:', req.url)
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  return next()
})

// server.use(AWSXRay.express.openSegment('NextJSApp'))

// server.use(files(path.join(__dirname, '../build/_next/static')))

// server.use(
//   '/_next/static',
//   files(path.join(__dirname, '../build/_next/static'), {
//     immutable: true,
//     maxAge: '1y',
//   })
// )

server.use(
  '/_next/static',
  files(path.join(__dirname, '../build/_next/static'))
)

server.use(files(path.join(__dirname, '../public')))

server.all('*', async (req, res) => {
  await init()
  return nextRequestHandler(req, res)
})

// server.use(AWSXRay.express.closeSegment())

module.exports.handler = require('serverless-http')(server)
