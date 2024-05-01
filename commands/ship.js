module.exports.info = {
    name: 'ship',
    usage: "<аргумент1> | <аргумент2>",
    aliases: ['ship', 'шип'],
    description: 'вероятность любви',
    permission: 1,
    enabled: true,
    sponsor: [2000000058, 2000000123, 2000000038],
    help: true
};

module.exports.run = async (context, delim) => {
    try {
        if (!delim) delim = context.text.split(' ')

        if (!delim[1])
            return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: /ship ${this.info.usage}`)

        const ship = context.text.split(delim[0])[1].split("|")

        if (!ship[0] || !ship[1])
            return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: /ship ${this.info.usage}`)

        context.reply(`💚 Вероятность любви между «${ship[0].trim()}» и «${ship[1].trim()}» - ${Math.floor(Math.random() * 99)}%`)
    } catch (e) {
        context.reply(`🗿 чо-т сломалось: ${e}`)
        console.error(e)
    }
};

module.exports.runPayload = async (context) => {
    this.run(context)
};