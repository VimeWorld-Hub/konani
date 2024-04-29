const VW = require('../libs/vimelibrary')
const config = require('../config')
const {Keyboard} = require('vk-io')
const messages = require("../libs/messages");

const VimeLibrary = new VW.User(config.vimeworld.dev_token)
const VimeUtils = new VW.Utils()

module.exports.info = {
    name: 'tops',
    usage: "<игрок>",
    aliases: ['tops', 'топы', 'топс', 'topi', 'ещзы', 'njgs', 't'],
    description: 'все мини-игры, где игрок состоит в топ-1000',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, params) => {
    try {
        if (!params || !params[1]) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${params[0]} ${this.info.usage}`)

        const symbols = params[1].split('')
        if (!await messages.testUsername(params[1])) return context.reply(`⚠ Никнейм может состоять только из латиницы, цифр и _`)

        if ((symbols.length < 3 || symbols.length > 16) && symbols[0] !== "=")
            return context.reply(`⚠ Никнейм должен быть длиной от 3-х до 16-и символов`)

        const player = await VimeLibrary.leaderboards(params[1], "nick")
        if (!player.user || !player.user.id) return context.reply('🔎 Игрока с таким никнеймом - не существует')

        const topList = ['']
        await VimeUtils.topsCache(config.vimeworld.dev_token)

        for (const top of player.leaderboards) {
            topList.push(await VimeUtils.getTops(top.type, top.sort, config.vimeworld.dev_token) + ` - ${top.place} место`)
        }

        let rank = (await VimeUtils.getRank(player.user.rank, config.vimeworld.dev_token)).prefix
        rank = (rank.split('').length >= 1) ? `[${rank}] ` : ``

        const message = (topList.length >= 2) ? `🏅 ${rank}${player.user.username} состоит в следующих топ-1000:\n`
            + topList.join('\n● ')
            + `\n\n📃 Всего: ${topList.length - 1}` : `🎖 ${rank}${player.user.username} не состоит ни в одном из топ-1000`

        context.reply({
            message: message,
            keyboard: Keyboard.builder()
                .textButton({
                    label: "👨‍💻 Статистика",
                    payload: `stats:${player.user.username}`,
                    color: Keyboard.SECONDARY_COLOR
                })
                .textButton({
                    label: "👕 Скин",
                    payload: `skin:${player.user.username}`,
                    color: Keyboard.SECONDARY_COLOR
                })
                .inline()
        })
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
}

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
}