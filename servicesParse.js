const axios = require('axios');
const cheerio = require('cheerio');
const Util = require('./Util')

const servicesParse = async url => {
    try {
        var services = await getChineseServicesData(url)
        await addEnglishData(services, url)
        return services
    } catch (err) {
        if (err) throw err
    }
}

const getChineseServicesData = async url => {
    try {
        const html = await axios(url)
        const $ = cheerio.load(html.data);
        const services = []
        $('table.event-table table > tbody ').each(function (index, tbody) {
            const service = {
                uuid: '',
                nosu: { zh: '', en: '' },
                nosp: { zh: '', en: '' },
                address: { zh: '', en: '' },
                tel: '',
                fax: ''
            }
            //collect data
            var data = []
            $('tr.desc > td', tbody).each(function (index, td) {
                data.push($(this).text())
            })
            //use data 
            for (var i = 0; i < data.length; i++) {
                if (data[i] == '服務單位名稱')
                    service.nosu.zh = data[i + 1]
                else if (data[i] == '營運機構名稱')
                    service.nosp.zh = data[i + 1]
                else if (data[i] == '地址')
                    service.address.zh = data[i + 1]
                else if (data[i] == '電話')
                    service.tel = data[i + 1]
                else if (data[i] == '傳真')
                    service.fax = data[i + 1]
            }
            service.uuid = Util.randomUUID();
            services.push(service)
        })
        return services;
    } catch (err) {
        if (err) throw err
    }
}

const addEnglishData = async (services, url) => {
    try {
        const enUrl = Util.convertToEnUrl(url)
        const html = await axios(enUrl)
        var $ = cheerio.load(html.data);
        $('table.event-table table > tbody ').each(function (index, tbody) {
            //collect data
            var data = []
            $('tr.desc > td', tbody).each(function (index, td) {
                data.push($(this).text())
            })
            // use data
            for (var i = 0; i < data.length; i++) {
                if (data[i] == 'Name of Service Unit')
                    services[index].nosu.en = data[i + 1]
                else if (data[i] == 'Name of Service Operator')
                    services[index].nosp.en = data[i + 1]
                else if (data[i] == 'Address')
                    services[index].address.en = data[i + 1]
            }
        })
    } catch (err) {
        if (err) throw err
    }
}

module.exports = servicesParse