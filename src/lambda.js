const server = require('restana')()
const files = require('serve-static')
const path = require('path')

const standaloneDir = path.join(__dirname, '../build/_next/standalone')
const Next = require(path.join(standaloneDir, 'node_modules/next'))

// https://github.com/vercel/next.js/issues/64031#issuecomment-2078708340
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

server.use(files(path.join(__dirname, '../build')))
server.use(files(path.join(__dirname, '../public')))

server.all('*', async (req, res) => {
  // serverless-http sets `req.body` to the raw body, and Next only parses a
  // body when `req.body` is empty. next-auth needs the parsed form body (its
  // CSRF token), so for its routes let Next parse the request stream itself.
  // Other routes keep the raw body, which they forward as it is.
  if (req.url.startsWith('/api/auth/')) {
    delete req.body
  }

  await init()
  return nextRequestHandler(req, res)
})

module.exports.handler = require('serverless-http')(server)
