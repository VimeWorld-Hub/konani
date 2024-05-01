const Mess = require('../libs/messages')
const {Keyboard} = require('vk-io')
const axios = require('axios')

module.exports.info = {
    name: 'pixelbattle',
    usage: "",
    aliases: ['pixelbattle', 'pb', 'пб', 'пиксель', 'пиксельбаттл'],
    description: 'информация о текущем PixelBattle',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    const res = await axios.get(`https://vimeworld.com/pixelbattle/meta.json`)

    let list = []
    let c = 0

    for (const command of res.data.top) {
        c += 1
        list.push(`${c}. ${command.tag}. Пикселей: ${command.pixels}`)
    }

    const header = (context.messagePayload)
        ? ''
        : '🎨 Топ PixelBattle:\n\n'
    const body = list.join("\n")
    const footer = `\n\n🌄 Подробнее: vime.one/pb`

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
                label: "🖼 Холст",
                payload: require('./pixelBattleMap').info.name,
                color: Keyboard.PRIMARY_COLOR
            })
            .inline()
    })
};

module.exports.runPayload = async (context) => {
    this.run(context)
};