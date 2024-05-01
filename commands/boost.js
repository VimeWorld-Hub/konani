const VW = require('../libs/vimelibrary')
const config = require('../config')

const mysql = require('../libs/mysql')
const {Keyboard} = require("vk-io");

module.exports.info = {
    name: 'boost',
    usage: "<игроки для проверки, через пробел>",
    aliases: ['boost'],
    description: 'поиск всех бустеров',
    permission: 2,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, delim) => {
    try {
        if (!delim) delim = context.text.split(" ")

        if (!delim || !delim[1]) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${delim[0]} ${this.info.usage}`)

        let players = context.text.split(delim[0])[1].trim()

        const res = await mysql.execute('SELECT * FROM boosters WHERE usernames = ? LIMIT 50', [players])
        const list = []

        if (!res || res.length <= 0) {
            return context.send(`🧹 Игроки чисты`)
        }

        for (const m of res) {
            list.push(`https://vimetop.ru/matches#${m.matchId}`)
        }

        context.send({
            message: `🤾‍♀️Матчи, в которых участвовали эти игроки (${res[0].date}-${res[res.length - 1].date}):\n\n` + list.join('\n') + `\n\n📃 Всего: ${list.length}`,
            dont_parse_links: true,
            keyboard: Keyboard.builder()
                .textButton({
                    label: "Буст",
                    payload: `addboosters:${players.replace(' ', ':')}`,
                    color: "negative"
                })
                .row()
                .textButton({
                    label: "Нет буста",
                    payload: `removeboosters:${players.replace(' ', ':')}`,
                    color: "positive"
                })
                .inline()
        })
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
}

module.exports.runPayload = async (context) => {
    const delim = context.messagePayload.split(':')
    this.run(context, delim)
}