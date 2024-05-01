const VW = require('../libs/vimelibrary')
const Mess = require('../libs/messages')
const config = require('../config')
const {Keyboard} = require('vk-io')

const VimeLibrary = new VW.Online(config.vimeworld.dev_token)
const VimeUtils = new VW.Utils()

module.exports.info = {
    name: 'online',
    usage: "",
    aliases: ['онлайн', 'online', 'онлаин', 'onl', 'онл'],
    description: 'онлайн на VimeWorld MiniGames',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    const res = await VimeLibrary.get()

    const online = res.separated
    const total = res.total

    let list = []

    await VimeUtils.gamesCache(config.vimeworld.dev_token)
    for (const game in online) {
       // if (game.toLowerCase() === "zombieclaus" && (new Date(Date.now())).getMonth() - 1 !== 11 && (new Date(Date.now())).getMonth() - 1 > 1) continue

        let rus = await VimeUtils.getGame(game, config.vimeworld.dev_token)

        list.push(`● ${rus}: ${online[game]}`)
    }

    const header = (context.messagePayload)
        ? ''
        : '🎮 Онлайн VimeWorld MiniGames:\n\n'
    const body = list.join("\n")
    const footer = `\n\n📃 Всего: ${total}`

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
                label: "🕹 Модовые сервера",
                payload: require('./m_online').info.name,
                color: Keyboard.PRIMARY_COLOR
            })
            .inline()
    })
};

module.exports.runPayload = async (context) => {
    this.run(context)
};
