const Router = require('@/utils/router')

const r = new Router()
r.get(WK_PRE + '/jiandan/:sub_model', compose(require('@/routes/jandan/pic')))

/**
 * handleRequest wrapper data to json
 * width cache feature
 * */
async function handleRequest(event) {
  const request = event.request
  const cacheUrl = new URL(request.url)

  // Construct the cache key from the cache URL
  const cacheKey = new Request(cacheUrl.toString(), request)
  const cache = caches.default

  // Check whether the value is already available in the cache
  // if not, you will need to fetch it from origin, and store it
  // in the cache for future access
  let response = await cache.match(cacheKey)

  if (!response || WK_DEBUG == 'on') {
    response = await r.route(event.request)

    // Cache API respects Cache-Control headers. Setting s-max-age to 60
    // will limit the response to be in cache for 60 seconds max
    // Any changes made to the response here will be reflected in the cached
    // value
    response.headers.append(
      'Cache-Control',
      'public, s-maxage=' + (WK_DEBUG == 'on' ? 0 : '6000'), // eslint-disable-line
    )

    // Store the fetched response as cacheKey
    // Use waitUntil so you can return the response without blocking on
    // writing to cache
    event.waitUntil(cache.put(cacheKey, response.clone()))
  }

  return response
}


function compose(fn) {
  return async function (_, params) {
    const init = {
      headers: {
        'content-type': 'application/json;charset=utf-8',
      },
    }
    try {
      let data = await fn(params)
      return new Response(JSON.stringify(data), init)
    } catch (e) {
      return new Response('Errow throw:' + e.message)
    }
  }
}

addEventListener('fetch', (event) => {
  try {
    return event.respondWith(handleRequest(event))
  } catch (e) {
    return event.respondWith(new Response('Error thrown ' + e.message))
  }
})

// TODO maby cron later
// addEventListener('scheduled', (event) => {
//   const init = {
//     headers: {
//       'content-type': 'text/html;charset=UTF-8',
//     },
//   }

//   event.waitUntil(
//     fetch('https://rss.tailxyzme.workers.dev/rss/jiandan/ooxx', init),
//   )
// })

