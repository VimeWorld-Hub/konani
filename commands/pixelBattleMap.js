const {Keyboard} = require('vk-io')
const axios = require('axios')

const vk = require('../index').vk

module.exports.info = {
    name: 'pixelbattlemap',
    usage: "",
    aliases: ['pixelbattlemap', 'pixelbattle_map', 'pb_m', 'пб_к', 'пиксель_к', 'пиксельбаттл_к'],
    description: 'карта текущего PixelBattle',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: false
};

module.exports.run = async (context) => {
    const res = await axios.get(`https://vimeworld.com/pixelbattle/meta.json`)

    vk.upload.messagePhoto({
        source: {
            value: res.data.image
        },
    }).then((attachment) => {
        vk.api.messages.send({
            message: (context.messagePayload)
                ? ''
                : `🖼 Холст PixelBattle:`,
            attachment,
            random_id: 0,
            peer_id: context.message.peer_id,
            reply_to: context.message.id,
            keyboard: Keyboard.builder()
                .textButton({
                    label: "📊 Обновить",
                    payload: this.info.name,
                    color: Keyboard.SECONDARY_COLOR
                })
                .textButton({
                    label: "🎨 Статистика",
                    payload: require('./pixelBattle').info.name,
                    color: Keyboard.PRIMARY_COLOR
                })
                .inline()
        })
    });
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};