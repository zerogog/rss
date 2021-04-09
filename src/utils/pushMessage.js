const apiServer = 'https://api.telegram.org'
const createMethod = name => {
  return async param => {
    const init = {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(param),
    }
    const url = `${apiServer}/${WK_TELE_TOKEN}/${name}`
    return await fetch(url, init)
  }
}
module.exports = {
  sendMessage: createMethod('sendMessage'),
  sendPhoto: createMethod('sendPhoto'),
}
