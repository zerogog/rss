const { match, pathToRegexp } = require('path-to-regexp')

/**
 *  Helper functions that when passed a request will return a
 *  boolean indicating if the request uses that HTTP method,
 *  header, host or referrer.
 *
 *  2021-04-12
 *  copy from "https://github.com/cloudflare/worker-template-router/blob/master/router.js"
 *  add Params method
 * */

const Method = method => req => {
  return req.method.toLowerCase() === method.toLowerCase()
}
const Get = Method('get')

// const Header = (header, val) => req => req.headers.get(header) === val
// const Host = host => Header('host', host.toLowerCase())
// const Referrer = host => Header('referrer', host.toLowerCase())

const Path = patten => req => {
  const regExp = pathToRegexp(patten)
  const url = new URL(req.url)
  const path = url.pathname

  return regExp.test(path)
}

const Param = patten => req => {
  const fn = match(patten, { decode: decodeURIComponent })
  const url = new URL(req.url)
  const path = url.pathname
  return fn(path).params
}

/**
 *  The Router handles determines which handler is matched given the
 *  conditions present for each request.
 *  */
class Router {
  constructor() {
    this.routes = []
  }

  // add params to get params
  handle(conditions, handler, params = {}) {
    this.routes.push({
      conditions,
      handler,
      params,
    })
  }

  get(url, handler) {
    return this.handle([Get, Path(url)], handler, Param(url))
  }

  all(handler) {
    return this.handle([], handler)
  }

  route(req) {
    const route = this.resolve(req)
    if (route) {
      return route.handler(req, route.params(req))
    }

    return new Response('resource not found', {
      status: 404,
      statusText: 'not found',
      headers: {
        'content-type': 'text/plain',
      },
    })
  }

  /**
   *  resolve returns the matching route for a request that returns
   *  true for all conditions (if any).
   * */
  resolve(req) {
    return this.routes.find(r => {
      if (!r.conditions || (Array.isArray(r) && !r.conditions.length)) {
        return true
      }

      if (typeof r.conditions === 'function') {
        return r.conditions(req)
      }

      return r.conditions.every(c => c(req))
    })
  }
}

module.exports = Router
