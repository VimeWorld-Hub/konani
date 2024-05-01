const mysql = require('../libs/mysql')
const messages = require('../libs/messages')
const {Keyboard} = require('vk-io')
const moment = require('moment')
const config = require('../config')
const vimeLibrary = require('../libs/vimelibrary')
const axios = require('axios')

const VimeLibrary = new vimeLibrary.User(config.vimeworld.dev_token)
const VimeGuild = new vimeLibrary.Guild(config.vimeworld.dev_token)
const VimeUtils = new vimeLibrary.Utils()

module.exports.info = {
    name: 'stats',
    usage: "<никнейм>,<никнейм_2>? <игра>? || <=айди> <игра>?",
    aliases: ['s', 'stats', 'стата', 'статс', 'статистика', 'player', 'игрок'],
    description: "статистика игрока MiniGames",
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, delim) => {
    try {
        delim = (!delim) ? context.text.split(" ") : delim
        if (!delim || !delim[1]) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${delim[0]} <никнейм> <игра>?`)

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
        const symbols = delim[1].split('')
        if (!await messages.testUsername(delim[1]) && /[=]/.test((symbols.length >= 1) ? symbols[0] : '') === false) return context.reply(`⚠ Никнейм может состоять только из латиницы, цифр и _`)

        if (symbols.length < 2 && symbols[0] == "=")
            return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${delim[0]} <=айди> <игра>?`)

        if ((symbols.length < 3 || symbols.length > 16) && symbols[0] !== "=" && delim[1].split(',').length <= 1)
            return context.reply(`⚠ Никнейм должен быть длиной от 3-х до 16-и символов`)

        let accountInformation = false;
        try {
            accountInformation = (await axios.get('https://cp.vimeworld.com/api/user?register=1&name=' + delim[1])).data
        } catch (e) {
            console.error(e)
        }

        const player = (symbols.length >= 2 && symbols[0] === "=") ? await VimeLibrary.get(delim[1].split('').slice(1).join(''), "id") : await VimeLibrary.get(delim[1], "nick")
        if (!player[0]) {
            const exits = accountInformation?.response?.exists;
            const available = accountInformation?.response?.available;

            if (!exits && !available) {
                return context.reply(`🕸 Игрок удалил свой аккаунт`)
            }

            if (!accountInformation || !exits) {
                return context.reply(`🔎 Игрок с таким никнеймом не заходил на VimeWorld`)
            }

            if (exits) {
                return context.reply(`👽 Игрок не заходил на сервер MiniGames`)
            }

            return context.reply(`👻 Игрок потерялся`)
        }

        let max = (player.length > 5) ? 4 : player.length


        for (let i = 0; i !== max; i++) {
            try {
                await mysql.execute('INSERT INTO `players`(`player`, `viewer`) VALUES (?, ?)', [player[i].id, context.senderId])
            } catch (e) {
            }
            new Promise(() => {
                const promise1 = VimeLibrary.achievements(player[i].id, "id")
                const promise2 = (delim[2]) ? VimeLibrary.stats(player[i].id, "id") : [];
                const promise3 = VimeLibrary.session(player[i].id, "id")
                const promise4 = VimeLibrary.friends(player[i].id, "id")
                const promise5 = VimeLibrary.leaderboards(player[i].id, "id")

                Promise.all([promise1, promise2, promise3, promise4, promise5]).then(async function (values) {
                    const d = [
                        'Давно',
                        'Очень давно',
                        'Раньше Большого Взрыва',
                        'Во время строительства пирамид',
                        'Перед отправкой Вояджера-1',
                        'Перед отправкой Вояджера-2'
                    ]
                    const lastSeen = (values[0].user.lastSeen === -1) ? d[Math.floor(Math.random() * d.length)] : moment.unix(values[0].user.lastSeen).format("DD.MM.YYYY")
                    const game = ['']
                    const rank = await VimeUtils.getRank(values[0].user.rank, config.vimeworld.dev_token)

                    let keyboard = (values[0].user.guild && values[0].user.guild.id)
                        ? Keyboard.builder()
                            .textButton({
                                label: "👕 Скин",
                                payload: `skin:${values[0].user.username}`,
                                color: Keyboard.PRIMARY_COLOR
                            })
                            .textButton({
                                label: "🏅 Топы",
                                payload: `tops:${values[0].user.username}`,
                                color: Keyboard.PRIMARY_COLOR
                            })
                            .row()
                            .textButton({
                                label: "👩🏻‍💻 Друзья",
                                payload: `friends:${values[0].user.username}`,
                                color: Keyboard.PRIMARY_COLOR
                            })
                            .textButton({
                                label: "🏹 Гильдия",
                                payload: `guild:${values[0].user.guild.id}`,
                                color: Keyboard.PRIMARY_COLOR
                            })
                            .row()
                            .textButton({
                                label: "🎯 Матчи",
                                payload: `matches:${values[0].user.username}`,
                                color: Keyboard.PRIMARY_COLOR
                            })
                            .textButton({
                                label: "🏆 Достижения",
                                payload: `achievements:${values[0].user.username}`,
                                color: Keyboard.PRIMARY_COLOR
                            })
                            .row()
                            .urlButton({
                                label: "🌐 Профиль VimeWorld",
                                url: `https://vimeworld.com/player/${values[0].user.username}`
                            })
                            .inline()
                        : Keyboard.builder()
                            .textButton({
                                label: "👕 Скин",
                                payload: `skin:${values[0].user.username}`,
                                color: Keyboard.PRIMARY_COLOR
                            })
                            .textButton({
                                label: "🏅 Топы",
                                payload: `tops:${values[0].user.username}`,
                                color: Keyboard.PRIMARY_COLOR
                            })
                            .row()
                            .textButton({
                                label: "👩🏻‍💻 Друзья",
                                payload: `friends:${values[0].user.username}`,
                                color: Keyboard.PRIMARY_COLOR
                            })
                            .textButton({
                                label: "🎯 Матчи",
                                payload: `matches:${values[0].user.username}`,
                                color: Keyboard.PRIMARY_COLOR
                            })
                            .row()
                            .textButton({
                                label: "🏆 Достижения",
                                payload: `achievements:${values[0].user.username}`,
                                color: Keyboard.PRIMARY_COLOR
                            })
                            .row()
                            .urlButton({
                                label: "🌐 Профиль VimeWorld",
                                url: `https://vimeworld.com/player/${values[0].user.username}`
                            })
                            .inline()

                    if (!values[1].stats) {
                        const Level_per = Math.round(values[0].user.levelPercentage * 100)
                        const playedHours = Math.floor(moment.duration(values[0].user.playedSeconds, "s").asHours());

                        let guild = "Отсутствует"
                        if (values[0].user.guild && values[0].user.guild.name) {
                            guild = values[0].user.guild.name
                            const guildInfo = await VimeGuild.get(values[0].user.guild.id, 'id')
                            let coins = -1;
                            let exp = -1;

                            for (const member of guildInfo.members) {
                                if (member.user.username === values[0].user.username) {
                                    coins = member.guildCoins
                                    exp = member.guildExp
                                }
                            }

                            guild += `\n└ Коинов: ${coins}, опыта: ${exp}`
                        }

                        game.push(`🏷 ID: ${values[0].user.id}`)
                        game.push(`💾 Уровень: ${values[0].user.level} (${Level_per}%)`)
                        game.push(`🖥 Проведено в игре: ${playedHours} ч.`)
                        game.push(`⛺ Гильдия: ${guild}`)

                        game.push(`\n👩🏻‍💻 Друзей: ${values[3].friends.length}`)
                        game.push(`🏆 Достижений: ${values[0].achievements.length}`)
                        game.push(`🏅 Топов: ${values[4].leaderboards.length}`)
                        context.reply({
                            message: `👨‍💻 ${(rank.prefix.split('').length >= 1 ? `[${rank.prefix}] ` : ``)}${values[0].user.username}\nАктивность: ${(values[2].online.message !== "Игрок оффлайн")
                                    ? `${values[2].online.message}`
                                    : `Оффлайн\nПоследний вход: ${lastSeen}`}\n`
                                + game.join('\n'),
                            keyboard: keyboard
                        })
                    } else {
                        let g = delim[2];
                        let type_stats = "Global";

                        if (g.toLowerCase().indexOf("_s") !== -1) {
                            g = g.toLowerCase().replace("_s", "");
                            type_stats = "Season";
                        }
                        const nameGame = await VimeUtils.getGamesAliases(g)
                        g = (nameGame) ? nameGame : g
                        if (!g) return context.reply('🔎 Неизвестная мини-игра.')

                        const stats = values[1].stats[g.toUpperCase()]
                        if (type_stats === "Season" && (!stats || !stats.season)) {
                            return context.reply(`⚔️Данная мини-игра не имеет сезонной статистики.`)
                        }

                        await VimeUtils.statsCache(config.vimeworld.dev_token)
                        for (const t in stats) {
                            if (type_stats == "Global" && t == 'global') {
                                for (const stat in stats[t]) {
                                    if (stat == 'blocks') break
                                    game.push(await VimeUtils.getStats(g, stat) + `: ${stats[t][stat]}`)
                                }
                                break
                            } else if (type_stats == "Season" && t == 'season') {
                                for (const x in stats[t]) {
                                    for (const stat in stats[t][x]) {
                                        if (stat == 'blocks') break
                                        game.push(await VimeUtils.getStats(g, stat) + `: ${stats[t][x][stat]}`)
                                    }
                                }
                                break
                            }
                        }
                        const ga = await VimeUtils.getGame(g, config.vimeworld.dev_token)
                        if (game.length < 2) return context.reply('🔎 Такой мини-игры не существует')

                        context.reply({
                            message: `👨‍💻 ${(rank.prefix.split('').length >= 1 ? `[${rank.prefix}] ` : ``)}${values[0].user.username}\nАктивность: ${(values[2].online.message !== "Игрок оффлайн")
                                    ? `${values[2].online.message}`
                                    : `Оффлайн\nПоследний вход: ${lastSeen}`}\n\n📊 ${ga} ${type_stats}:`
                                + game.join('\n ● ')
                        })
                    }
                })
            })
        }
    } catch (e) {
        console.error(e)
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
};

module.exports.runPayload = async (context) => {
    const delim = context.messagePayload.split(':')

    try {
        await this.run(context, delim)
    } catch (e) {
        console.error(e)
        context.reply(`⚠ При выполнении команды (payload) произошла ошибка`)
    }
};