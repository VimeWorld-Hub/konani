const VW = require('../libs/vimelibrary')
const config = require('../config')

const VimeLibrary = new VW.Total(config.vimeworld.dev_token)
const VimeUtils = new VW.Utils()

module.exports.info = {
    name: 'top',
    usage: "<мини-игра>",
    aliases: ['top', 'njg', 'ещз', 'топ'],
    description: 'просмотр топ-100 мини-игры',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, params) => {
    try {
        if (!params || !params[1]) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${params[0]} ${this.info.usage}`)

        let season = false

        if (params[1].toLowerCase().indexOf("_s") !== -1) {
            params[1] = params[1].toLowerCase().replace("_s", "");
            season = true
        }

        let game = await VimeUtils.getGamesAliases(params[1])
        game = (game) ? game : params[1]

        if (season) {
            if (game == 'prison') game = game + "_season"
            else game = game + "_monthly"
        }

        let found = false
        let sort = null
        let header = null

        const list = await VimeLibrary.Leaderboard.list();
        for (const g of list) {
            if (g.type == game) {
                found = true
                for (const s of g.sort) {
                    header = "🏅 " + g.description
                    if (!params[2]) sort = g.sort[0]
                    else if (params[2] == s) sort = s
                }
            }
        }

        if (header == null) {
            return context.reply(`🔎 Такой мини-игры - не существует`)
        }

        if (sort == null) {
            return context.reply(`🔎 У этой мини-игры нет сортировки по «${params[2]}»\n\n⚠ Если вы хотели проверить игрока в топе, то воспользуйтесь командой /tops (/tops ${params[2]})`)
        }

        const top = await VimeLibrary.Leaderboard.get(game, sort, 100)

        header = header.replace('игроков на ', '')
        header = header.replace('(в этом месяце)', 'Season')

        const topers = ['']

        await VimeUtils.rankCache()
        let n = 0
        console.log(top)
        for (const player of top.records) {
            n++
            const rank = (await VimeUtils.getRank(player.user.rank)).prefix
            topers.push(`${n}. ${(rank.split('').length >= 1) ? `[${rank}] ` : ``}${player.user.username}. ${await VimeUtils.getTopStatRus(sort)}: ${player[sort]}`)
        }

        context.reply({
            message: header + " по " + await VimeUtils.getTopRus(sort)
                + topers.slice(0, 51).join('\n')
        })

        setTimeout(() => {
            context.send({
                message: topers.slice(51, topers.length).join('\n')
            })
        }, 10)
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
}

module.exports.runPayload = async (context) => {
    const delim = context.messagePayload.split(':')
    this.run(context, delim)
}