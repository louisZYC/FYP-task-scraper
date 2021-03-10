const axios = require('axios');
const cheerio = require('cheerio');
const Util = require('./Util')

const url = 'https://www.swd.gov.hk/tc/index/site_district/page_kwuntong/';


const districtsParse = async url => {
    try {
        var districts = await getChineseDistrictsData(url)
        districts = await addEnglishData(districts, url)
        return districts
    } catch (err) {
        if (err) throw err
    }
}

const getChineseDistrictsData = async url => {
    const html = await axios(url)
    const $ = cheerio.load(html.data)
    const districts = []
    $('a.link_75').each(function (index, a) {
        if ($(this).text().indexOf('社會福利署管理或撥款的福利服務單位') == -1) return
        districts.push({
            name: { zh: $(this).text().split(/\(|\)/)[1], en: '' },
            href: a.attribs.href
        })
    })

    if (districts.length == 1)
        return districts.map(x => {
            x.name.zh = $('title').text().split(' - ')[1]
            return x
        })

    return districts
}

const addEnglishData = async (districts, url) => {
    const enUrl = Util.convertToEnUrl(url)
    const html = await axios(enUrl)
    const $ = cheerio.load(html.data);
    var counter = 0
    $('a.link_75').each(function (index, a) {
        if ($(this).text().indexOf('Social Welfare Department') == -1) return
        districts[counter++].name.en = $(this).text().split(/\(|\)/)[1]
    })


    if (districts.length == 1)
        return districts.map(x => {
            x.name.en = $('title').text().split(' - ')[1]
            return x
        })

    return districts
}
// districtsParse(url).then(x => { console.log(x) })
module.exports = districtsParse