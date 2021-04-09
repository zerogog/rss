/**
 * get content by url
 * @param url
 * @param init config
 *
 * doc:
 * https://developers.cloudflare.com/workers/runtime-apis/request#requestinit
 * @return text | json
 * */
module.exports = async (
  url,
  init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  },
) => {
  const response = await fetch(url, init)
  const { headers } = response
  const contentType = headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json())
  } else {
    return await response.text()
  }
}
