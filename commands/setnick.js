const mysql = require('../libs/mysql')
const config = require('../config')
const vimeLibrary = require('../libs/vimelibrary')
const messages = require("../libs/messages");

const VimeLibrary = new vimeLibrary.User(config.vimeworld.dev_token)
const VimeUtils = new vimeLibrary.Utils()

module.exports.info = {
    name: 'setnick',
    usage: "<никнейм>",
    aliases: ['setnick', 'сетник', 'установитьник', 'уник'],
    description: 'смена привязанного никнейма',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: false
};

module.exports.run = async (context, delim, user) => {
    if (delim.length < 2) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${delim[0]} <никнейм>`)

    const symbols = delim[1].split('')
    if (!await messages.testUsername(delim[1]) && /[=]/.test((symbols.length >= 1) ? symbols[0] : '') === false) return context.reply(`⚠ Никнейм может состоять только из латиницы, цифр и _`)

    if ((symbols.length < 3 || symbols.length > 16) && symbols[0] !== "=")
        return context.reply(`⚠ Никнейм должен быть длиной от 3-х до 16-и символов`)

    try {
        const player = await VimeLibrary.get(delim[1], "nick")
        if (!player[0]) return context.reply(`🔎 Игрока с таким никнеймом - не существует`)

        const rank = (await VimeUtils.getRank(player[0].rank, config.vimeworld.dev_token)).prefix

        try {
            await mysql.execute("UPDATE users SET username=? WHERE id=?", [player[0].username, context.senderId])
        } catch (e) {
            console.error(e)
        }
        //TODO: пофиксить команд

        context.reply({
            message: `📲 Никнейм успешно изменен\n└ Новый аккаунт: ${(rank.split('').length >= 1) ? `[${rank}] ` : ``}${player[0].username}`
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
        context.reply(`При выполнении команды произошла ошибка`)
    }
};