const Mess = require('../libs/messages')
const {Keyboard} = require('vk-io')
const config = require('../config')
const VW = require('../libs/vimelibrary')
const messages = require("../libs/messages");

const VimeLibrary = new VW.Match(config.vimeworld.dev_token)
const VimeUser = new VW.User(config.vimeworld.dev_token)
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

module.exports.run = async (context, delim) => {
    try {
        if (!delim) delim = context.text.split(" ")

        if (!delim[1]) return context.send({
            message: `🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${delim[0]} ${this.info.usage}`,
            reply_to: context.message.id
        })

        const match = await VimeLibrary.get(delim[1])

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
                    payload: `match:players:${delim[1]}`
                })
                .textButton({
                    label: "✨ События",
                    payload: `match:events:${delim[1]}`
                })
        })
    } catch (e) {

    }
    return
    try {


        if (delim[1]) {
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

            const list = await matchInfo(res.matches)

            let rank = (await VimeUtils.getRank(res.user.rank, config.vimeworld.dev_token)).prefix
            rank = (rank.split('').length >= 1) ? `[${rank}] ` : ``

            let wins = 0
            for (const match of res.matches) {
                if (match.win) wins += 1
            }

            const header = (context.messagePayload)
                ? ''
                : `🎯 Последние матчи ${rank}${res.user.username}:\n\n`
            const body = list.join("\n")
            const footer = `\n\n🏆 Побед: ${wins}/${res.matches.length} (${Math.floor((wins / res.matches.length) * 100)}%)`

            const mess = new Mess.Message(header, body, footer)

            context.reply({
                message: await mess.get(),
                keyboard: Keyboard.builder()
                    .textButton({
                        label: "👨‍💻 Статистика",
                        payload: `stats:${res.user.username}`,
                        color: Keyboard.SECONDARY_COLOR
                    })
                    .textButton({
                        label: "👕 Скин",
                        payload: `skin:${res.user.username}`,
                        color: Keyboard.SECONDARY_COLOR
                    })
                    .inline()
            })

            return
        }
        const res = await VimeLibrary.latest()
        const list = await matchInfo(res)

        const header = (context.messagePayload)
            ? ''
            : '🏓 Последние матчи:\n'
        const body = list.join("\n")
        const footer = ``

        const mess = new Mess.Message(header, body, footer)

        context.reply({
            message: await mess.get(),
            keyboard: Keyboard.builder()
                .textButton({
                    label: "📊 Обновить",
                    payload: this.info.name,
                    color: Keyboard.SECONDARY_COLOR
                })
                .inline()
        })
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
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