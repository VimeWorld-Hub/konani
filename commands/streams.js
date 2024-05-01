const VW = require('../libs/vimelibrary')
const config = require('../config')
const Mess = require('../libs/messages')
const {Keyboard} = require('vk-io')

const VimeLibrary = new VW.Online(config.vimeworld.dev_token)
const VimeUtils = new VW.Utils()

module.exports.info = {
    name: 'streams',
    usage: "",
    aliases: ['streams', 'стримы', 'трансляции'],
    description: 'список текущих стримов на MiniGames',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    try {
        const res = await VimeLibrary.streams()

        let list = ['']

        await VimeUtils.rankCache(config.vimeworld.dev_token)
        for (const stream of res) {
            const rank = (await VimeUtils.getRank(stream.user.rank)).prefix
            list.push(`${stream.title}\n├ Стример: ${(rank.split('').length >= 1) ? `[${rank}] ` : ``}${stream.user.username}\n └ Ссылка: ${stream.url}`)
        }


        const header = (context.messagePayload)
            ? ''
            : '🎥 Стримы онлайн:\n\n'
        const body = list.join("\n\n")
        const footer = `\n\n📃 Всего: ${list.length - 1}`

        const mess = new Mess.Message(header, body, footer)

        context.reply({
            message: await mess.get(),
            keyboard: Keyboard.builder()
                .textButton({
                    label: "📊 Обновить",
                    payload: this.info.name,
                    color: Keyboard.SECONDARY_COLOR
                })
                .textButton({
                    label: "🛡 Модеры",
                    payload: require('./staff').info.name,
                    color: Keyboard.PRIMARY_COLOR
                })
                .inline()
        })
    } catch (e) {
        console.error(e)
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
};

module.exports.runPayload = async (context) => {
    this.run(context)
};