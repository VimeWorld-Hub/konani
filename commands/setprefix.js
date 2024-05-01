const mysql = require('../libs/mysql')
const vk = require('../index').vk

module.exports.info = {
    name: 'setprefix',
    usage: "<префикс>",
    aliases: ['setprefix', 'сетпрефикс'],
    description: 'смена префикса команд',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    const delim = context.text.split(' ')
    if (delim[1])
        if (delim[1].split('').length > 2 && delim[1].split('').length < 1)
            return context.reply(`📡 Префикс может быть длиною от 1-го до 2-ух символов\n\nНапример: «/», «!», «k.»`)

    if (!delim[1]) return context.reply({
        message: `🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${delim[0]} <префикс>`
    });
    let sql = `UPDATE users SET prefix=? WHERE id=?`

    if (/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/.test(String.fromCodePoint(delim[1].codePointAt(0))))
        return context.reply({
            message: `🚫 Данный префикс не поддерживается`
        })

    if (context.isChat) {
        try {
            const members = await vk.api.messages.getConversationMembers({
                peer_id: context.peerId
            })
            const chat = await mysql.execute(`SELECT * FROM chats WHERE id = ?`, [delim[1], context.peerId])

            let found = false
            for (const p of members.items) {
                if (p.member_id == context.senderId && p.is_admin) found = true
            }

            if (!found) return context.reply(`🚫 Доступно только Администраторам беседы`)

            sql = `UPDATE chats SET prefix=? WHERE id=?`

            try {
                await mysql.execute(sql, [delim[1], context.peerId])
                return context.reply(`📡 Префикс успешно изменен${(context.isChat) ? "\n\n⚠ Если у бота не будет прав Администратора, то все команды будут игнорироваться" : ""}`)
            } catch (e) {
                context.reply({
                    message: `🚫 Данный префикс не поддерживается`
                })
            }
        } catch (e) {
            console.error(e)
            context.reply(`⚠ Для выполнения этой команды требуется выдать боту права Администратора`)
        }
    } else {
        try {
            await mysql.execute(sql, [delim[1], context.peerId])
            return context.reply(`📡 Префикс успешно изменен${(context.isChat) ? "\n⚠ Если у бота не будет прав Администратора, то все команды будут игнорироваться" : ""}`)
        } catch (e) {
            context.reply({
                message: `🚫 Данный префикс не поддерживается`
            })
        }
    }
};

module.exports.runPayload = async (context) => {
    try {
        await this.run(context)
    } catch (e) {
        context.reply(`При выполнении команды произошла ошибка`)
    }
};