'use strict'
const servicesParse = require('./servicesParse')
const bigGroupsParse = require('./bigGroupsParse')
const districtsParse = require('./districtsParse')
const urlsParse = require('./urlsParse')
const Util = require('./Util')
const fs = require('fs')
const url = 'https://www.swd.gov.hk/tc/index/site_district/';
const domainName = "https://www.swd.gov.hk";

(async () => {
    try {
        const districtsUrls = Util.mapUrl(await urlsParse(url))
        const districts = await Util.inParallel(districtsUrls, districtsParse)

        const bigGroupsUrls = Util.mapUrl(districts)
        const bigGroups = await Util.inParallel(bigGroupsUrls, bigGroupsParse)

        const servicesUrls = Util.mapUrl(bigGroups)
        const services = await Util.inParallelWithLimit(servicesUrls, 30, servicesParse)
        // console.log(JSON.stringify(services, null, 2))

        // fs.writeFile('services.json', JSON.stringify(services), { flag: 'w' }, () => { console.log('services.json saved') })
        return
    } catch (err) {
        if (err) throw err
    }
})()




// const url = 'https://www.swd.gov.hk/tc/index/site_district/page_cwsi/sub_infobook2/id_527/dir_1/';
// servicesParse(url).then(x=>console.log(x))

// const url = 'https://www.swd.gov.hk/tc/index/site_district/page_cwsi/sub_infobook2/';
// bigGroupsParse(url).then(x => console.log(x))

// const url = 'https://www.swd.gov.hk/tc/index/site_district/page_wongtaisin/';
// districtsParse(url).then(x=>console.log(x))