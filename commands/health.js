const config = require('../config')
const VW = require('../libs/vimelibrary')

const VimeLibrary = new VW.Total(config.vimeworld.dev_token)

module.exports.info = {
    name: 'health',
    usage: "",
    aliases: ['health', 'здоровье'],
    description: 'здоровье методов VimeWorld',
    permission: 5,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    const start = Date.now()
    await new Promise(() => {
        var promise1 = VimeLibrary.User.get("xtrafrancyz", 'nick')
        var promise2 = VimeLibrary.User.get(134568, 'id')
        var promise3 = VimeLibrary.User.friends("xtrafrancyz", "nick")
        var promise4 = VimeLibrary.User.session("xtrafrancyz", "nick")
        var promise5 = VimeLibrary.User.stats("xtrafrancyz", "nick")
        var promise6 = VimeLibrary.User.leaderboards("xtrafrancyz", "nick")
        var promise7 = VimeLibrary.User.achievements("xtrafrancyz", "nick")

        Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7]).then(function (values) {
            const methods = []

            if (values[0][0].id) methods.push(`✔ /user/name/`)
            else methods.push(`✖ /user/name/`)

            if (values[1][0].id) methods.push(`✔ /user/:ids/`)
            else methods.push(`✖ /user/name/`)

            if (values[2].user && values[2].user.id) methods.push(`✔ /user/:id/friends`)
            else methods.push(`✖ /user/:id/friends`)

            if (values[3].user && values[3].user.id) methods.push(`✔ /user/:id/session`)
            else methods.push(`✖ /user/:id/session`)

            if (values[4].user && values[4].user.id) methods.push(`✔ /user/:id/stats`)
            else methods.push(`✖ /user/:id/stats`)

            if (values[5].user && values[5].user.id) methods.push(`✔ /user/:id/leaderboards`)
            else methods.push(`✖ /user/:id/leaderboards`)

            if (values[6].user && values[6].user.id) methods.push(`✔ /user/:id/achievements`)
            else methods.push(`✖ /user/:id/achievements`)

            context.reply({
                message: `💫 Здоровье методов Public VimeWorld API:\n\n`
                    + methods.join("\n")
                    + `\n\n⌛ Выполнено за ${Date.now() - start}мс`
            })
        })
    })
};

module.exports.runPayload = async (context) => {
    this.run(context)
};