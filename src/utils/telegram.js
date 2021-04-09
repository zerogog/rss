/**
 * telegram message create *
 */

module.exports = function(request, data) {
  try {
    if (!data) {
      return null
    }
    const {
      // itunes_author,
      // link,
      // description,
      // atomlink,
      // itunes_category,
      // itunes_explicit,
      // image,
      // language,
      // lastBuildDate,
      // ttl,
      
      item,
      title,
      tag,
      messageType, // photo, text, video
    } = data

    const createText = (type, data) => {
      const text = `\\#${type}  \\#${tag}  \\#${title}\n *${
        data.title
      }*\n\n 发布时间：${data.pubDate.toUTCString()}\n [来源](${data.link})`
      return text
    }

    const createMsg = (type, data) => {
      let res = { chat_id: WK_CHAT_ID, parse_mode: 'MarkdownV2' }

      if (type === 'photo') {
        res.photo = data.image
        res.caption = createText(type, data)
      } else if (type === 'text') {
        res.text = createText(type, data)
      }
      return res
    }

    const messages = item.map(temp => createMsg(messageType, temp))
    return messages
  } catch (e) {
    return e.message
  }
}
