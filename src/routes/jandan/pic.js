const cheerio = require('cheerio')
const got = require('@/utils/got')
const { parseRelativeDate } = require('@/utils/time')

const baseUrl = 'https://jandan.net/'
module.exports = async params => {
  const { sub_model } = params
  const url = `${baseUrl}${sub_model}/`
  const response = await got(url, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      Referer: 'http://jandan.net',
    },
  })
  const $ = cheerio.load(response)
  let rssTitle
  let description
  switch (sub_model) {
    case 'pic':
      rssTitle = '煎蛋无聊图'
      description = '煎蛋官方无聊图，无限活力的热门图区'
      break
    case 'ooxx':
      rssTitle = '煎蛋随手拍'
      description = '分享你的经典一刻'
      break
    case 'zoo':
      rssTitle = '煎蛋动物园'
      description = '专吸各种萌物'
      break
    case 'girl':
      rssTitle = '煎蛋女装图'
      description = ''
      break
    case 'top-ooxx':
      rssTitle = '煎蛋随手拍热榜'
      description = '手机相册中的有趣的图片'
      break
    case 'top-4h':
      rssTitle = '煎蛋4小时热榜'
      description = '煎蛋无聊图4小时热门排行榜'
      break
    case 'top':
      rssTitle = '煎蛋无聊图热榜'
      description = '煎蛋无聊图热门排行榜'
      break
    default:
      rssTitle = '未知内容'
      description =
        '未知内容，请前往 https://github.com/DIYgod/RSSHub/issues 提交 issue'
  }

  // Cache last fetch time
  let lastUpdate = await KV_TELE.get(url) // eslint-disable-line
  if (lastUpdate) {
    lastUpdate = new Date(lastUpdate).getTime()
  }
  const res = {
    title: rssTitle,
    link: url,
    description,
    messageType: 'photo',
    tag: '煎蛋',
    item: $('.commentlist > li[id^="comment"]')
      .map((_, comment) => {
        comment = $(comment)
        const id = comment.find('.righttext > a').text()
        const author = comment.find('.author > strong').text()
        const timeInfo =
          comment
            .find('.author small')
            .text()
            .replace('minutes', '分钟')
            .replace('hours', '小时')
            .replace('days', '天')
            .replace(/.*?(\d+)\s?(分钟|小时|天|周).*/, '$1$2前') || ''
        return {
          link: `https://jandan.net/t/${id}`,
          title: `${author}/${id}`,
          author,
          pubDate: parseRelativeDate(timeInfo),
          guid: id,
          image:
            'https:' +
            comment
              .find('.text > p')
              .find('a')
              .attr('href'),
          description: '',
        }
      })
      .filter(comment => {
        if (lastUpdate === null) {
          return true
        }
        const pubDate = new Date(comment.pubDate).getTime()
        return pubDate >= lastUpdate
      })
      .get(),
  }

  // Just reset lastUpdate time when got datas
  if (res.item.length) {
    await KV_TELE.put(url, new Date().toUTCString()) // eslint-disable-line
  }

  return { msg: "No fresh data!" }
}
