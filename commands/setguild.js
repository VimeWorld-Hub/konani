const mysql = require('../libs/mysql')
const config = require('../config')
const vimeLibrary = require('../libs/vimelibrary')

const VimeLibrary = new vimeLibrary.Guild(config.vimeworld.dev_token)

module.exports.info = {
    name: 'setguild',
    usage: "<айди>",
    aliases: ['setguild', 'угильд', 'установитьгильдию'],
    description: 'смена привязанной гильдии',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: false
};

module.exports.run = async (context) => {
    const delim = context.text.split(' ')

    if (delim.length < 2) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${delim[0]} <айди>`)
    if (!delim[1].match(/^[0-9]+$/)) return context.reply("⚠ Айди гильдии может состоять только из натуральных чисел (больше 0)")

    try {
        const guild = await VimeLibrary.get(delim[1], "id")
        if (!guild.id) return context.reply(`🔎 Такой гильдии не существует.\n\nДля поиска по ключевым словам, можете воспользоваться командой /gs`)

        try {
            await mysql.execute("UPDATE users SET guild=? WHERE id=?", [guild.id, context.senderId])
        } catch (e) {
            console.error(e)
        }

        context.reply({
            message: `📲 Гильдия успешно изменена\n└ Новый клан: {${guild.id}} ${guild.name}`
        })
    } catch (e) {
        console.error(e)
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
};

module.exports.runPayload = async (context) => {
    try {
        await this.run(context, context.messagePayload.split(':'))
    } catch (e) {
        console.error(e)
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
};