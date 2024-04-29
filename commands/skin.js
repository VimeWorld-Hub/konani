const config = require('../config')
const vimeLibrary = require('../libs/vimelibrary')
const axios = require('axios')
const Jimp = require('jimp')
const {Keyboard} = require('vk-io')
const fs = require('fs')
const messages = require('../libs/messages')

const VimeLibrary = new vimeLibrary.User(config.vimeworld.dev_token)
const VimeUtils = new vimeLibrary.Utils()

const vk = require('../index').vk

module.exports.info = {
    name: 'skin',
    usage: "<игрок>",
    aliases: ['скин', 'одежда', 'skin', 'скен', 'cape', 'плащ'],
    description: 'скин и плащ игрока',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, params) => {
    try {
        if (!params[1]) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${params[0]} <никнейм> <игра>?`)

        const symbols = params[1].split('')
        if (!await messages.testUsername(params[1])) return context.reply(`⚠ Никнейм может состоять только из латиницы, цифр и _`)

        if ((symbols.length < 3 || symbols.length > 16) && symbols[0] !== "=")
            return context.reply(`⚠ Никнейм должен быть длиной от 3-х до 16-и символов`)

        const data = await VimeLibrary.get(params[1], 'nick')
        if (!data[0] || !data[0].id) {
            return context.reply('🔎 Игрока с таким никнеймом - не существует')
        }
        const rank = await VimeUtils.getRank(data[0].rank, config.vimeworld.dev_token)

        const body = axios.get(`http://skin.vimeworld.com/body/${data[0].username}.png`, {responseType: 'arraybuffer'});
        let back = axios.get(`http://skin.vimeworld.com/back/${data[0].username}.png`, {responseType: 'arraybuffer'})

        Promise.all([body, back]).then(function (values) {
            Promise.all([
                Jimp.read(values[0].data),
                Jimp.read(values[1].data),
            ])
                .then(async function (results) {
                    let cape = await axios.get(`https://skin.vimeworld.com/cape/${data[0].username}.png`, {
                        validateStatus: false,
                        responseType: 'arraybuffer'
                    })

                    let imag = new Jimp(160, 240, 'transparent')
                    if (cape.data.length > 50) {
                        let t = await Jimp.read(cape.data)
                        imag.composite(t, 0, 0)
                            .resize(109, 160)
                    }

                    let image = new Jimp(323, 320, 'white');
                    image.composite(results[0], 0, 0)
                    image.composite(results[1], 163, 0)
                    image.composite(imag, 190, 80)
                        .rgba(false)
                        .background(0xFFFFFFFF)
                        .write(`./images/${data[0].username}.jpg`);

                    vk.upload.messagePhoto({
                        source: {
                            value: fs.createReadStream(`./images/${data[0].username}.jpg`)
                        },
                    })
                        .then((attachment) => {
                            vk.api.messages.send({
                                message: `👕 Скин ${(rank.prefix.split('').length >= 1) ? `[${rank.prefix}] ` : ``}${data[0].username}:`,
                                attachment,
                                random_id: 0,
                                peer_id: context.message.peer_id,
                                reply_to: context.message.id,
                                keyboard: Keyboard.builder().inline()
                                    .textButton({
                                        label: "👨‍💻 Статистика",
                                        payload: `stats:${data[0].username}`,
                                        color: Keyboard.PRIMARY_COLOR
                                    })
                                    .textButton({
                                        label: "🏅 Топы",
                                        payload: `tops:${data[0].username}`,
                                        color: Keyboard.PRIMARY_COLOR
                                    })
                                    .row()
                                    .urlButton({
                                        label: "Скачать скин",
                                        url: `https://mc.vimeworld.com/launcher/skins/${data[0].username}.png`
                                    })
                                    .urlButton({
                                        label: "Скачать плащ",
                                        url: `https://mc.vimeworld.com/launcher/cloaks/${data[0].username}.png`
                                    })
                            })
                            fs.unlinkSync(`./images/${data[0].username}.jpg`);
                        });
                }).catch(function (err) {
                console.error(err);
                context.reply({
                    message: `🚫 При генерации скина произошла ошибка.\n\n${err}`
                })
            })
        })
    } catch (e) {
        console.error(e)
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};