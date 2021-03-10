const axios = require('axios');
const cheerio = require('cheerio');
const Util = require('./Util')

const bigGroupsParse = async url => {
    try {
        var bigGroups = await getChineseBigGroupsData(url)
        await addEnglishData(bigGroups, url)
        return bigGroups
    } catch (err) {
        if (err) throw err
    }
}

const getChineseBigGroupsData = async url => {
    const html = await axios(url)
    const $ = cheerio.load(html.data);
    const bigGroups = []
    $('a.link_75').each(function (index, a) {
        bigGroups.push({
            uuid: Util.randomUUID(),
            name: { zh: $(this).text(), en: '' },
            href: a.attribs.href
        })
    })
    return bigGroups
}

const addEnglishData = async (bigGroups, url) => {
    const enUrl = Util.convertToEnUrl(url)
    const html = await axios(enUrl)
    const $ = cheerio.load(html.data);
    $('a.link_75').each(function (index, a) {
        bigGroups[index].name.en = $(this).text()
    })
}

module.exports = bigGroupsParse;