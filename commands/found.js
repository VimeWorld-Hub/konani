const vk = require('../index').vk

module.exports.info = {
    name: 'found',
    usage: "",
    aliases: ['found', 'поиск'],
    description: 'поиск ^_^',
    permission: 1,
    enabled: true,
    sponsor: [2000000058],
    help: true
};

module.exports.run = async (context, delim) => {
    try {
        const members = await vk.api.messages.getConversationMembers({
            peer_id: context.peerId
        })
        const count = members.profiles.length
        const random = Math.floor(Math.random() * count)

        const p = members.profiles[random]
        context.reply(`💚 ^_^ найден - это [id${p.id}|${p.first_name} ${p.last_name}]`)
    } catch (e) {
        console.error(e)
        context.reply(`Мяфф, я люблю власть! Пока в моих лапках не будет админки - данная команда не будет работать (а если она есть, то че-то пошло не так)`)
    }
};

module.exports.runPayload = async (context) => {
    this.run(context)
};