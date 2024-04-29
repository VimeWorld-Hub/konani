const Mess = require('../libs/messages')
const {Keyboard} = require('vk-io')
const config = require('../config')
const VW = require('../libs/vimelibrary')
const messages = require("../libs/messages");

const VimeLibrary = new VW.Match(config.vimeworld.dev_token)
new VW.User(config.vimeworld.dev_token);
const VimeUtils = new VW.Utils()

module.exports.info = {
    name: 'match',
    usage: "<айди>",
    aliases: ['match', 'матч', 'метч', 'metch', 'ьфеср', 'vfnx'],
    description: 'подробная информация о матче',
    permission: 1,
    enabled: false,
    sponsor: [],
    help: false
};

module.exports.run = async (context, params) => {
    try {
        if (!params[1]) return context.send({
            message: `🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${params[0]} ${this.info.usage}`,
            reply_to: context.message.id
        })

        const match = await VimeLibrary.get(params[1])

        if (!match || (match[0] && match[0].error)) return context.reply({
            message: '🔎 Матч с таким ID не найден',
            keyboard: Keyboard.builder()
                .inline()
                .textButton({
                    label: "🎰 Мне повезёт!",
                    payload: "match:random"
                })
        })

        context.reply({
            message: `⛳ ${await VimeUtils.getGame(match.game, config.vimeworld.dev_token)}`
                + `\n● Победитель: `
                + `\n● Карта: ${(match.mapName) ? `${match.mapName} (${match.mapId})` : "Отсутствует"}`
                + `\n● Сервер: ${match.server}`
                + `\n● Продолжительность: с ${match.start} до ${match.end}`,
            keyboard: Keyboard.builder()
                .inline()
                .textButton({
                    label: "👨‍💻 Игроки",
                    payload: `match:players:${params[1]}`
                })
                .textButton({
                    label: "✨ События",
                    payload: `match:events:${params[1]}`
                })
        })
    } catch (e) { /* empty */
    }
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};

async function matchInfo(matches) {
    const list = []
    await VimeUtils.gamesCache(config.vimeworld.dev_token)

    for (const match of matches) {
        let dur = Math.floor(match.duration / 60)
        if (dur == 0) dur = `${match.duration} сек`
        else if (dur >= 60) dur = `${Math.floor(dur / 60)} час`
        else dur = `${dur} мин`

        if (match.win != null) {
            let game = await VimeUtils.getGame(match.game, config.vimeworld.dev_token)
            if (match.game.toLowerCase() == 'swt') game = 'SkyWars Team'
            else if (match.game.toLowerCase() == 'bwh') game = 'BedWars Hard'
            else if (match.game.toLowerCase() == 'bwq') game = 'BedWars Quick'

            list.push(`${(match.win == true) ? '🌕' : '🌑'} ${game}: ${(match.map && match.map.name) ? `${match.map.name}` : `-`}. Длительность: ${dur}.`)
        } else {
            let game = await VimeUtils.getGame(match.game, config.vimeworld.dev_token)
            if (match.game.toLowerCase() == 'swt') game = 'SkyWars Team'
            else if (match.game.toLowerCase() == 'bwh') game = 'BedWars Hard'
            else if (match.game.toLowerCase() == 'bwq') game = 'BedWars Quick'
            else if (match.game.toLowerCase() == 'hgl') game = 'HungerGames Lucky'

            list.push(`● [${match.players}] ${game}: ${(match.map && match.map.name) ? `${match.map.name}` : `-`}. Длительность: ${dur}.`)
        }
    }

    return list
}