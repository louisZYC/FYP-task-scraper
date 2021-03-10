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
    }
}

module.exports = Util
