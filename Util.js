Util = {
    convertToEnUrl: url => {
        var url = url.match(/https?:\/|[^\/]+/g)
        url.splice(2, 1, 'en')
        return url.join('/')
    },
    randomUUID: function () {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 32; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    chunk: function (list, size) {
        const out = []
        for (let i = 0; i < list.length; i += size) {
            out.push(list.slice(i, i + size))
        }
        return out
    },
    inSeries: async function (args, asyncFn) {// run async in series 
        return args.reduce(async (acc, arg) => {
            const results = await acc;
            console.log(arg)
            try {
                results.push(await asyncFn(arg))
            } catch (err) {
                if (err) throw err
            }
            console.log(JSON.stringify(results, null, 2))
            return results
        }, Promise.resolve([]));
    },
    inParallel: async function (args, asyncFn) { //run async in parallel
        try {
            const results = await Promise.all(
                args.map(async (arg) => {
                    return asyncFn(arg)
                })
            )
            // [[1,2],[2,3],[3,4]] -> [1,2,2,3,3,4]
            return results.reduce((acc, items) => [...acc, ...items], []);
        } catch (err) {
            if (err) throw err
        }
    },
    inParallelWithLimit: async function (args, concurrency, asyncFn) {//limit the number of operations that  run in parallel. 
        const batches = this.chunk(args, concurrency)//
        const results = await this.inSeries(batches, async (batch) => {
            return this.inParallel(batch, asyncFn)
        })
        return results.reduce((acc, items) => [...acc, ...items], []);
    },
    mapUrl: function (list) {
        return list.map(
            ({ href }) => 'https://www.swd.gov.hk' + href
        )
    }
}

module.exports = Util
