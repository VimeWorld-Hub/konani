const mysql = require('../libs/mysql')
const {Keyboard} = require("vk-io");

module.exports.info = {
    name: 'findboosters',
    usage: "<макс количество, по умолчанию - 20>",
    aliases: ['findboosters', 'fboosters', 'fboost'],
    description: 'поиск бустеров',
    permission: 2,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, delim) => {
    try {
        if (!delim) delim = context.text.split(" ")

        let limit = (delim[1]) ? delim[1] : 20
        let correct = false

        try {
            if (Number(limit)) correct = true
        } catch (e) {
        }

        if (!correct) {
            limit = 20
            context.send(`⚠ Количество записей неверное, будет выведено 20`)
        }

        const res = await mysql.execute('SELECT COUNT(*) as repetitions, usernames FROM boosters GROUP BY usernames HAVING repetitions > 9 LIMIT ?', [Number(limit)])

        const list = []
        for (const m of res) {
            list.push(`{${m.repetitions}} ${m.usernames}`)
        }

        context.reply({
            message: `🤾‍♀️Возможные бустеры:\n\n` + list.join('\n'),
            dont_parse_links: true,
            keyboard: Keyboard.builder()
                .textButton({
                    label: "📊 Обновить",
                    payload: this.info.name,
                    color: Keyboard.SECONDARY_COLOR
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