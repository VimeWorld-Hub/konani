const VW = require('../libs/vimelibrary')
const messages = require("../libs/messages");

const VimeUser = new VW.User('')

module.exports.info = {
    name: 'boostb',
    usage: "<игрок>?",
    aliases: ['boostb'],
    description: 'последние матчи на MiniGames',
    permission: 2,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, delim) => {
    try {
        if (!delim) delim = context.text.split(" ")

        const symbols = delim[1].split('')
        if (delim[1].toLowerCase().includes("@me")) {
            const get = await new messages.User().getNick(context)
            if (get) {
                delim[1] = get
            } else {
                return context.send({
                    message: `📲 Вы ещё не привязали свой никнейм.\n\nВоспользуйтесь командой: /setnick <ник>`,
                    reply_to: context.message.id
                })
            }
        }
        if (!await messages.testUsername(delim[1])) return context.reply(`⚠ Никнейм может состоять только из латиницы, цифр и _`)

        if ((symbols.length < 3 || symbols.length > 16) && symbols[0] !== "=")
            return context.reply(`⚠ Никнейм должен быть длиной от 3-х до 16-и символов`)

        const res = await VimeUser.matches(delim[1], 'nick')
        if (!res || !res.user) return context.reply(`🔎 Игрока с таким никнеймом не существует`)
        else if (res.matches.length < 1) return context.reply(`🔎 У игрока нет последних матчей`)

        const ls = []
        for (const match of res.matches) {
            ls.push(`https://vimetop.ru/matches#${match.id}`)
        }
        context.reply({
            message: ls.join('\n')
        })
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};