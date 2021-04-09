module.exports = function(data) {
  if (!data) {
    return `<?xml version="1.0" encoding="UTF-8"?> <rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"> <title>Not Match</title> </rss>`
  }
  const {
    itunes_author,
    item,
    title,
    link,
    description,
    atomlink,
    itunes_category,
    itunes_explicit,
    image,
    language,
    lastBuildDate,
    ttl,
  } = data

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"
${
  itunes_author
    ? `xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"`
    : item && item.some(i => i.media)
    ? `xmlns:media="http://search.yahoo.com/mrss/"`
    : ''
}>
    <channel>
        <title><![CDATA[${title || 'RSSHub'}]]></title>
        <link>${link || 'https://docs.rsshub.app'}</link>
        <atom:link href="${atomlink}" rel="self" type="application/rss+xml" />
        <description><![CDATA[${description ||
          title} - Made with love by RSSHub(https://github.com/DIYgod/RSSHub)]]></description>
        <generator>RSSHub</generator>
        <webMaster>i@diygod.me (DIYgod)</webMaster>
        ${
          itunes_author
            ? '<itunes:author>' + itunes_author + '</itunes:author>'
            : ''
        }
        ${
          itunes_category
            ? '<itunes:category text="' + itunes_category + '"/>'
            : ''
        }
        ${
          itunes_author
            ? '<itunes:explicit>' +
              (itunes_explicit || 'clean') +
              '</itunes:explicit>'
            : ''
        }
        <language>${language || 'zh-cn'}</language>
        ${
          image
            ? `<image>
            <url>${image}</url>
            <title><![CDATA[${title || 'RSSHub'}]]></title>
            <link>${link}</link>
        </image>
        `
            : ''
        }
        <lastBuildDate>${lastBuildDate}</lastBuildDate>
        <ttl>${ttl}</ttl>
        ${(function() {
          let strArr = []
          strArr = item.map(value => {
            return `
              <item>
                  <title><![CDATA[${value.title}]]></title>
                  <description><![CDATA[${value.description ||
                    value.title}]]></description>
                  ${
                    value.pubDate
                      ? '<pubDate>' + value.pubDate + '</pubDate>'
                      : ''
                  }
                  <guid isPermaLink="false">${value.guid ||
                    value.link ||
                    value.title}</guid>
                  <link>${value.link}</link>
                  ${
                    value.itunes_item_image
                      ? '<itunes:image href="' + value.itunes_item_image + '"/>'
                      : ''
                  }
                  ${
                    value.enclosure_url
                      ? `<enclosure url="${value.enclosure_url}" `
                      : ''
                  }
                  ${
                    value.enclosure_length
                      ? `length="${value.enclosure_length}" `
                      : ''
                  }
                  ${
                    value.enclosure_type
                      ? `type="${value.enclosure_type}" `
                      : ''
                  }/>
                  ${
                    itunes_author && value.itunes_duration
                      ? `<itunes:duration>${value.itunes_duration}</itunes:duration>`
                      : ''
                  }
                  ${
                    value.author
                      ? `<author><![CDATA[${value.author}]]></author>`
                      : ''
                  }

                  ${
                    value.category && typeof value.category === 'string'
                      ? `<category>${value.category}</category>`
                      : ``
                  }

                  ${
                    !value.media
                      ? ''
                      : `${(function() {
                          return value.media
                            .map((tag, index) => {
                              return `<media:${index}>
                                ${
                                  tag
                                    ? (function() {
                                        return tag
                                          .map((data, idx) => {
                                            return `${idx}="${data}" `
                                          })
                                          .join()
                                      })()
                                    : ''
                                }
                              </media:${index}`
                            })
                            .join()
                        })()}`
                  }
              </item>`
          })

          return strArr.join('')
        })()}
    </channel>
</rss>
`
}
