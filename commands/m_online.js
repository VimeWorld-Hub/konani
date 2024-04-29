const Mess = require('../libs/messages')
const {Keyboard} = require('vk-io')
const axios = require('axios')

module.exports.info = {
    name: 'm_online',
    usage: "",
    aliases: ['м_онлайн', 'm_online', 'м_онлаин', 'm_onl', 'м_онл', 'monline', 'монл', 'монлайн'],
    description: 'онлайн на VimeWorld Mods',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    try {
        const res = await axios.get(`http://mc.vimeworld.com/mon/min.json`).catch(function (err) {
            console.log(err);
            context.send({
                message: `🕯 При попытке получить онлайн произошла ошибка.`,
                reply_to: context.message.id
            })
        });

        const list = []
        let total = 0
        let max = 0

        const civ = []

        for (const server in res.data) {
            if (server === "MiniGames") continue

            if (server === "CivCraft") {
                civ.push(`● ${server}: ${res.data[server].online}/${res.data[server].max}`)
                continue
            }

            total += res.data[server].online
            max += res.data[server].max

            if (max === 0) {
                list.push(`● ${server}: 0/0 (Рестарт)`)
                continue
            }

            list.push(`● ${server}: ${res.data[server].online}/${res.data[server].max}`)
        }

        const header = (context.messagePayload)
            ? ''
            : '🕹 Онлайн VimeWorld Mods:\n\n'
        const body = list.join("\n")
        const footer = `\n\n📃 Всего: ${total}/${max}`

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
                    label: "🎮 Мини-Игры",
                    payload: require('./online').info.name,
                    color: Keyboard.PRIMARY_COLOR
                })
                .row()
                .textButton({
                    label: "    📺 О серверах",
                    payload: require('./m_info').info.name,
                    color: Keyboard.SECONDARY_COLOR
                })
                .inline()
        })
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }

    /*
    const l = []
    l.push({
        "title": "civ",
        "description": "Пикселей: 12738",
        "buttons": [
            {
                "action": {
                    "type": "callback",
                    "label": "Текст кнопки 🌚",
                    "payload": "{}"
                },
            },
        ]
    })

    for(const server in res.data){
        if(server === "MiniGames" || server === "CivCraft") continue

        l.push({
            "title": server,
            "description": "Описание",
            "buttons": [
                {
                    "action": {
                        "type": "text",
                        "label": "Текст кнопки 🌚",
                        "payload": "123"
                    },
                }
            ]
        })
    }
    let keyboard = {
        "type": "carousel",
        "elements": l
    }
    context.reply({
        message: `🎨 Топ PixelBattle:`,
        template: JSON.stringify(keyboard)
    })*/
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};