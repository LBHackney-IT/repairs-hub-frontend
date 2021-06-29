import LRU from 'lru-cache'

const CACHE_MAX_SIZE = 500
const CACHE_MAX_AGE_IN_MS = 300000 // 5 minutes

const context = {
  cache: new LRU({
    max: CACHE_MAX_SIZE,
    maxAge: CACHE_MAX_AGE_IN_MS,
  }),
}

const cache = (handler) => (req, res) => {
  req.cache = context.cache

  return handler(req, res)
}

export default cache
