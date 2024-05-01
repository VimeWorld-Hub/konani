const messages = require('../libs/messages')
const config = require('../config')
const vimeLibrary = require('../libs/vimelibrary')

const VimeLibrary = new vimeLibrary.User(config.vimeworld.dev_token)
const VimeUtils = new vimeLibrary.Utils()

module.exports.info = {
    name: 'friends',
    usage: "<игрок>",
    aliases: ['friends', 'друзья', 'френдс', 'френды', 'f'],
    description: 'друзья игрока',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, delim) => {
    if (!delim) delim = context.text.split(' ')

    if (!delim[1]) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${delim[0]} <никнейм> <игра>?`)

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
    if (!await messages.testUsername(delim[1])) return context.reply(`⚠ Никнейм может состоять только из латиницы, цифр и _`)

    if ((symbols.length < 3 || symbols.length > 16) && symbols[0] !== "=")
        return context.reply(`⚠ Никнейм должен быть длиной от 3-х до 16-и символов`)

    const player = await VimeLibrary.friends(delim[1], 'nick')
    if (!player.user || !player.user.id) return context.reply(`🚫 Игрока с таким никнеймом не существует`)
    else if (player.friends.length < 1) return context.reply(`🚷 У ${(await VimeUtils.getRank(player.user.rank, config.vimeworld.dev_token)).prefix}${player.user.username} нет друзей.`)

    const friendsIDs = []
    const friends = ['']

    for (const friend of player.friends) {
        friendsIDs.push(friend.id)
    }

    const friendsActivity = await VimeLibrary.sessionBig(friendsIDs)

    await VimeUtils.rankCache(config.vimeworld.dev_token)
    for (const friend in player.friends) {
        const online = (friendsActivity[friend].online.value) ? '🌕' : '🌑'
        const rank = await VimeUtils.getRank(player.friends[friend].rank, config.vimeworld.dev_token)

        friends.push(`${online} ${(rank.prefix.split('').length >= 1) ? `[${rank.prefix}] ` : ``}${player.friends[friend].username}`)
    }

    friends.sort()
    friends.push('')
    friends.reverse()
    const rank = await VimeUtils.getRank(player.user.rank, config.vimeworld.dev_token)

    if (friends.length >= 100) {
        await context.reply(`👩🏻‍💻 Друзья ${(rank.prefix.split('').length >= 1) ? `[${rank.prefix}] ` : ``}${player.user.username}:\n`
            + friends.slice(0, 49).join('\n'))
        await context.send(friends.slice(49, 100).join('\n'))
        context.send(friends.slice(100, 150).join('\n')
            + `\n\n📃 Всего: ${player.friends.length}`)
    } else if (friends.length >= 50) {
        await context.reply(`👩🏻‍💻 Друзья ${(rank.prefix.split('').length >= 1) ? `[${rank.prefix}] ` : ``}${player.user.username}:\n`
            + friends.slice(0, 49).join('\n'))
        context.send(friends.slice(49, 100).join('\n')
            + `\n\n📃 Всего: ${player.friends.length}`)
    } else {
        context.reply(`👩🏻‍💻 Друзья ${(rank.prefix.split('').length >= 1) ? `[${rank.prefix}] ` : ``}${player.user.username}:\n`
            + friends.join('\n')
            + `\n\n📃 Всего: ${player.friends.length}`)
    }

};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(":"))
};