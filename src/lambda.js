const server = require('restana')()
const files = require('serve-static')
const path = require('path')
// const AWSXRay = require('aws-xray-sdk')

// AWSXRay.enableAutomaticMode()

const standaloneDir = path.join(__dirname, '../build/_next/standalone')
const Next = require(path.join(standaloneDir, 'node_modules/next'))

const { config } = require('./.next/required-server-files.json')
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config)

const app = Next({
  dev: false,
  dir: standaloneDir,
  conf: {
    distDir: '.next',
    // ...config
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

// server.use(AWSXRay.express.openSegment('NextJSApp'))

server.use(files(path.join(__dirname, '../build/_next/static')))
server.use(files(path.join(__dirname, '../public')))

server.all('*', async (req, res) => {
  await init()
  return nextRequestHandler(req, res)
})

// server.use(AWSXRay.express.closeSegment())

module.exports.handler = require('serverless-http')(server)
