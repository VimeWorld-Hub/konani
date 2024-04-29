const vk = require('../index').vk

module.exports.info = {
    name: 'suicide',
    usage: "<айди ВК>",
    aliases: ['suicide'],
    description: 'удаление участника по ID',
    permission: 3,
    enabled: false,
    sponsor: [2000000001, 2000000058],
    help: false
};

module.exports.run = async (context) => {
    try {
        if (context.senderId != 584536789) return context.reply(`Нет`)
        try {
            await vk.api.messages.removeChatUser({
                chat_id: context.peerId % 2000000000,
                user_id: 584536789,
                member_id: 584536789
            })
        } catch (e) {
            if (e.code && e.code === 935) {
                context.reply("935")
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