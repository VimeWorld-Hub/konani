const VW = require('../libs/vimelibrary')
const Mess = require('../libs/messages')
const config = require('../config')
const {Keyboard} = require('vk-io')
const messages = require("../libs/messages");

const VimeLibrary = new VW.Total(config.vimeworld.dev_token)
const VimeUtils = new VW.Utils()

module.exports.info = {
    name: 'achievements',
    usage: "<игрок>",
    aliases: ['achievements', 'ach', 'ачивки', 'ач', 'дос', 'дост', 'достижения'],
    description: 'достижения игрока',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, delim) => {
    try {
        if (!delim) delim = context.text.split(" ")

        if (!delim || !delim[1]) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${delim[0]} ${this.info.usage}`)

        if (delim[1].toLowerCase().includes("@me")) {
            const get = await new messages.User().getNick(context)
            if (get) {
                delim[1] = get
            } else {
                return context.send({
                    message: `📲 Вы ещё не привязали свой никнейм.\n\nВоспользуйтесь командой: /setnick <ник>`,
                    reply_to: context.message.id
                })
            }
        }
        const symbols = delim[1].split('')
        if (!await messages.testUsername(delim[1])) return context.reply(`⚠ Никнейм может состоять только из латиницы, цифр и _`)

        if ((symbols.length < 3 || symbols.length > 16) && symbols[0] !== "=")
            return context.reply(`⚠ Никнейм должен быть длиной от 3-х до 16-и символов`)

        new Promise(() => {
            const player = VimeLibrary.User.achievements(delim[1], "nick")
            const ach = VimeLibrary.Misc.achievements()

            Promise.all([player, ach]).then(async function (values) {
                const list = []

                for (const achm of values[0].achievements) {
                    for (const cat in values[1]) {
                        if (cat == "token") continue
                        for (ac of values[1][cat]) {
                            if (ac.id === achm.id) {
                                list.push([cat, ac.title])
                            }
                        }
                    }
                }

                list.sort()

                let rank = (await VimeUtils.getRank(values[0].user.rank, config.vimeworld.dev_token)).prefix
                rank = (rank.split('').length >= 1) ? `[${rank}] ` : ``

                const arr = new Map();
                for (const elem of list) {
                    if (arr.has(elem[0])) {
                        arr.set(elem[0], Number(arr.get(elem[0])) + 1);
                    } else {
                        arr.set(elem[0], 1);
                    }
                }

                const final = ['']

                arr.forEach((value, name) => final.push(`${name}: ${value}/${values[1][name].length}`))

                const header = (context.messagePayload)
                    ? ''
                    : `🏆 Достижения игрока ${rank}${values[0].user.username}:\n\n`
                const body = final.join('\n● ')
                const footer = `\n\n📃 Всего выполнено: ${values[0].achievements.length}`

                const mess = new Mess.Message(header, body, footer)

                context.reply({
                    message: await mess.get(),
                    keyboard: Keyboard.builder()
                        .textButton({
                            label: "👨‍💻 Статистика",
                            payload: `stats:${values[0].user.username}`,
                            color: Keyboard.SECONDARY_COLOR
                        })
                        .textButton({
                            label: "👕 Скин",
                            payload: `skin:${values[0].user.username}`,
                            color: Keyboard.SECONDARY_COLOR
                        })
                        .inline()
                })
            })
        })
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
}

module.exports.runPayload = async (context) => {
    const delim = context.messagePayload.split(':')
    this.run(context, delim)
}