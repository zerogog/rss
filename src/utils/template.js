const parse = require('@/utils/rss')
const config = {
  titleLengthLimit: 30,
  type: 'rss',
}
const unsupportedRegex = /\.json$/
module.exports = (request, data) => {
  if (request.url.match(unsupportedRegex)) {
    return '<b>JSON output had been removed, see: <a href="https://github.com/DIYgod/RSSHub/issues/1114">https://github.com/DIYgod/RSSHub/issues/1114</a></b>'
  }

  if (!data) return
  data.item &&
    data.item.forEach(item => {
      if (item.title) {
        item.title = item.title.trim()
        // trim title length
        const length = item.title.length
        if (length > config.titleLengthLimit) {
          item.title = `${item.title.slice(0, length)}...`
        }
      }

      if (item.enclosure_length) {
        const itunes_duration =
          Math.floor(item.enclosure_length / 3600) +
          ':' +
          (Math.floor((item.enclosure_length % 3600) / 60) / 100)
            .toFixed(2)
            .slice(-2) +
          ':' +
          (((item.enclosure_length % 3600) % 60) / 100).toFixed(2).slice(-2)
        item.itunes_duration = itunes_duration
      }
    })

  data = {
    lastBuildDate: new Date().toUTCString(),
    updated: new Date().toISOString(),
    ttl: 0, // todo
    atomlink: request.url,
    ...data,
  }

  try {
    data = parse(data)
  } catch (e) {
    console.log(e.message)
  }

  return data
}
