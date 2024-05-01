const VW = require('../libs/vimelibrary')
const Mess = require('../libs/messages')
const config = require('../config')
const {Keyboard} = require('vk-io')

const VimeLibrary = new VW.Online(config.vimeworld.dev_token)
const VimeUtils = new VW.Utils()

module.exports.info = {
    name: 'staff',
    usage: "",
    aliases: ['staff', 'стафф', 'стаф', 'модеры', 'модераторы', 'модерс', 'moders', 'moderations'],
    description: 'список Модераторов в сети на MiniGames',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    try {
        const res = await VimeLibrary.staff()
        const list = []

        await VimeUtils.rankCache()
        for (const player of res) {
            const rank = (await VimeUtils.getRank(player.rank)).prefix
            list.push(`● ${(rank.split('').length >= 1) ? `[${rank}] ` : ``}${player.username}`)
        }

        const header = (context.messagePayload)
            ? ''
            : '🛡 Модераторы в сети:\n\n'
        const body = list.join("\n")
        const footer = `\n\n📃 Всего: ${list.length}`

        context.reply({
            message: await new Mess.Message(header, body, footer).get(),
            keyboard: Keyboard.builder()
                .textButton({
                    label: "📊 Обновить",
                    payload: this.info.name,
                    color: Keyboard.SECONDARY_COLOR
                })
                .textButton({
                    label: "🎥 Стримы",
                    payload: require('./streams').info.name,
                    color: Keyboard.PRIMARY_COLOR
                })
                .inline()
        })
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
};

module.exports.runPayload = async (context) => {
    this.run(context)
};