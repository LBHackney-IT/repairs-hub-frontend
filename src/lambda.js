const server = require('restana')()
const files = require('serve-static')
const path = require('path')
const fs = require('fs')
// const AWSXRay = require('aws-xray-sdk')

// AWSXRay.enableAutomaticMode()

const standaloneDir = path.join(__dirname, '../build/_next/standalone')
const Next = require(path.join(standaloneDir, 'node_modules/next'))

const { config } = require(path.join(
  standaloneDir,
  'build/_next/required-server-files.json'
))
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config)

console.log('=== FILESYSTEM CHECK ===')
console.log('__dirname:', __dirname)

const staticDir = path.join(__dirname, '../build/_next/static')
console.log('Static dir path:', staticDir)
console.log('Static dir exists:', fs.existsSync(staticDir))

if (fs.existsSync(staticDir)) {
  console.log('Static dir contents:', fs.readdirSync(staticDir))

  const chunksDir = path.join(staticDir, 'chunks')
  if (fs.existsSync(chunksDir)) {
    console.log('Chunks dir exists!')
    const chunks = fs.readdirSync(chunksDir)
    console.log('Number of chunks:', chunks.length)
    console.log('First 10 chunks:', chunks.slice(0, 10))

    // Check for specific file
    const webpackFile = chunks.find((f) => f.includes('webpack'))
    console.log('Found webpack file:', webpackFile)
  } else {
    console.log('Chunks dir does NOT exist')
  }
}

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
  console.log(
    `REQUEST: URL="${req.url}" Method="${req.method}" Path: "${req.path}"`
  )
  return next()
})

// server.use(AWSXRay.express.openSegment('NextJSApp'))

server.use(
  '/_next/static',
  files(path.join(__dirname, '../build/_next/static'))
)

server.use((req, res, next) => {
  // Manually handle /_next/static requests
  if (req.url.startsWith('/_next/static')) {
    const filePath = path.join(__dirname, '../build', req.url)
    console.log('Trying to serve:', filePath)
    return files(path.join(__dirname, '../build'))(req, res, next)
  }

  return next()
})

server.use(files(path.join(__dirname, '../public')))

server.all('*', async (req, res) => {
  await init()
  return nextRequestHandler(req, res)
})

// server.use(AWSXRay.express.closeSegment())

module.exports.handler = require('serverless-http')(server)
