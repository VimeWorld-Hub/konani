const messages = require('../libs/messages')
const config = require('../config')
const vimeLibrary = require('../libs/vimelibrary')
const axios = require("axios");

const VimeLibrary = new vimeLibrary.User(config.vimeworld.dev_token)
const VimeUtils = new vimeLibrary.Utils()

module.exports.info = {
    name: 'tester',
    usage: "<игрок>",
    aliases: ['tester', 'тестер'],
    description: 'доступ к тестовым сборкам',
    permission: 3,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, params) => {
    if (!params[1]) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${params[0]} <никнейм>`)

    const symbols = params[1].split('')
    if (!await messages.testUsername(params[1])) return context.reply(`⚠ Никнейм может состоять только из латиницы, цифр и _`)

    if ((symbols.length < 3 || symbols.length > 16) && symbols[0] !== "=")
        return context.reply(`⚠ Никнейм должен быть длиной от 3-х до 16-и символов`)

    const player = await VimeLibrary.get(params[1], 'nick')
    if (!player[0])
        return

    const res = await axios.get(`https://launcher.vimeworld.com/data/servers.php?username=${player[0].username}`)
    let rank = (await VimeUtils.getRank(player[0].rank, config.vimeworld.dev_token)).prefix
    rank = (rank.split('').length >= 1) ? `[${rank}] ` : ``
    if (res.data.length <= 9)
        return context.reply(`🛠 ${rank}${player[0].username} не имеет доступа к тестовым сборкам VimeWorld`)

    const list = ['']

    for (const server of res.data) {
        list.push(`${server.name}: ${server.client}`)
    }

    context.reply(`🛠 ${rank}${player[0].username} имеет доступ к ${res.data.length - 9} тестовым сборкам:\n ${list.slice(10).join('\n')}`)
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};