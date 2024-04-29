module.exports.info = {
    name: 'ship',
    usage: "<аргумент1> | <аргумент2>",
    aliases: ['ship', 'шип', 'shiр'],
    description: 'вероятность любви',
    permission: 1,
    enabled: true,
    sponsor: [2000000058, 2000000123, 2000000038],
    help: true
};

module.exports.run = async (context, params) => {
    try {
        if (!params[1])
            return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: /ship ${this.info.usage}`)

        const ship = context.text.split(params[0])[1].split("|")

        if (!ship[0] || !ship[1])
            return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: /ship ${this.info.usage}`)

        const percent = (params[0] === '/shiр') ? randomInteger(90, 99) : randomInteger(1, 99)

        context.reply(`💚 Вероятность любви между «${ship[0].trim()}» и «${ship[1].trim()}» - ${percent}%`)
    } catch (e) {
        context.reply(`🗿 чо-т сломалось: ${e}`)
        console.error(e)
    }
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}