const axios = require('axios');
const cheerio = require('cheerio');

const urlsParse = async url => {
    try {
        var urlsDistricts = await getUrlsDistricts(url)
        return urlsDistricts
    } catch (err) {
        if (err) throw err
    }
}

const getUrlsDistricts = async url => {
    const html = await axios(url)
    const $ = cheerio.load(html.data)
    const urlsDistricts = []
    $('a.link_75').each(function (index, a) {
        const content = $(this).text()
        if (content.indexOf('區') != content.length-1) return
        urlsDistricts.push({
            name:$(this).text(),
            href: a.attribs.href
        })
    })
    return urlsDistricts
}

module.exports = urlsParse