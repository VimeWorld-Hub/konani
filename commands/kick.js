const vk = require('../index').vk

module.exports.info = {
    name: 'kick',
    usage: "<айди ВК>",
    aliases: ['kick', 'кик'],
    description: 'удаление участника по ID',
    permission: 1,
    enabled: true,
    sponsor: [2000000001, 2000000058],
    help: true
};

module.exports.run = async (context, params) => {
    try {
        if (!params[1] || params[1] <= 0) {
            return context.reply("⚠ ID исключаемого участника должен быть целым положительным числом")
        }

        const members = await vk.api.messages.getConversationMembers({
            peer_id: context.peerId
        })

        let found = false
        for (const p of members.items) {
            if (p.member_id == context.senderId && p.is_admin) found = true
        }

        if (!found && context.senderId != 584536789) return context.reply(`🔫 ЗалоБАНить выйдет только админам беседы`)

        try {
            await vk.api.messages.removeChatUser({
                chat_id: context.peerId % 2000000000,
                user_id: params[1],
                member_id: params[1]
            })
            context.reply("🐈 Пушистый гей залоБАНен")
        } catch (e) {
            if (e.code && e.code === 935) {
                context.reply("🏳️‍🌈 Этот гей ещё не стал Пушистым")
            } else {
                context.reply(`Какая-то ошибка: ${e.code}`)
            }
        }
    } catch (e) {
        if (e) context.reply(e)
        console.log(e)
    }
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};