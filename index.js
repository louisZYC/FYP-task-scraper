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
        const mixedDistricts = await urlsParse(url)

        const districtsData = await Promise.all(
            mixedDistricts.map(m => {
                return districtsParse(domainName + m.href)
            })
        )

        const districts = districtsData.reduce(
            (acc, d) => acc.concat(d)
        )

        const bigGroupsData = await Promise.all(
            districts.map(d => {
                return bigGroupsParse(domainName + d.href)
            })
        )

        const bigGroups = bigGroupsData.reduce(
            (acc, b) => acc.concat(b)
        )

        //Test
        const batchesOfGroups = Util.chunk(bigGroups, 30)
        const servicesData = await batchesOfGroups.reduce(
            async (acc, batchOfGroups) => {
                const servicesData = await acc
                var results = await Promise.all(
                    batchOfGroups.map(
                        ({ href }) => {
                            console.log(href)
                            return servicesParse(domainName + href)
                        }
                    )
                )
                //concatenate result
                results = results.reduce(
                    (acc, r) => acc.concat(r)
                )
                console.log(results)
                servicesData.push(results)
                return servicesData
            }, Promise.resolve([])
        )

        const services = servicesData.reduce(
            (acc, s) => acc.concat(s)
        )

        fs.writeFile('services.json', JSON.stringify(services), { flag: 'w' }, () => { console.log('services.json saved') })

    } catch (err) {
        if (err) console.log(err.message)
    }
})()


// const url = 'https://www.swd.gov.hk/tc/index/site_district/page_cwsi/sub_infobook2/id_527/dir_1/';
// servicesParse(url).then(x=>console.log(x))

// const url = 'https://www.swd.gov.hk/tc/index/site_district/page_cwsi/sub_infobook2/';
// bigGroupsParse(url).then(x => console.log(x))

// const url = 'https://www.swd.gov.hk/tc/index/site_district/page_wongtaisin/';
// districtsParse(url).then(x=>console.log(x))