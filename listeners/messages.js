const config = require("../config")
const fs = require("fs")
const NodeCache = require("node-cache")
const mysql = require("../libs/mysql")
const {User} = require("../structure/User");

const prefix = process.env.PREFIX
const commands = parseCommandsList()
//TODO: перенести в отдельный файл для удобной работы в командах
const userStorage = new NodeCache()

const usernameAliases = ['я', 'me', '@me', '[id2050|@me]']

async function newMessage(context) {
    const start = Date.now()

    log(context)
    await newMessageProcessing(context)

    log(`Выполнено за ${Date.now() - start}мс`)
}

async function newMessageProcessing(context) {
    let cmd
    let params

    if (context.messagePayload) {
        cmd = context.messagePayload.command || context.messagePayload.text || context.messagePayload || ""
        if (!cmd) return

        params = cmd.split(':')
        cmd = params[0]
    } else {
        cmd = context?.text

        if (!cmd) return
        if (cmd[0] !== prefix) return

        params = cmd.split(' ')
        cmd = params[0].slice(1)
    }

    if (!commands.has(cmd)) return

    const command = commands.get(cmd)
    const user = await getUser(context.senderId)

    if (!user.canUse(command.info.permission)) {
        return context.reply('🔒 | У вас недостаточно прав для этого действия')
    }
    if (command.info.sponsor.length > 0 && !command.info.sponsor.includes(context.peerId)) return

    if (usernameAliases.includes(params[1])) {
        let data

        if (command.info.name === 'guild') {
            const guild = user.getGuildId()
            if (!guild) {
                return context.send({
                    message: `📲 Вы ещё не добавили свою гильдию.\n\nВоспользуйтесь командой: /setguild <ник>`,
                    reply_to: context.message.id
                });
            }

            data = `=${guild}`
        } else {
            const username = user.getUsername()
            if (!username) {
                return context.send({
                    message: `📲 Вы ещё не привязали свой никнейм.\n\nВоспользуйтесь командой: /setnick <ник>`,
                    reply_to: context.message.id
                })
            }
            data = username
        }

        params[1] = data
    }

    (context.messagePayload) ? await command.runPayload(context, params, user) : await command.run(context, params, user)
}

async function getUser(id) {
    let cachedUser = userStorage.get(id)
    if (cachedUser) return cachedUser

    const user = await mysql.execute('SELECT * FROM `users` WHERE `id` = ?', [id])
    if (!user[0]) {
        await mysql.execute(`insert into users(id)
                             values (?)`, [id])
        cachedUser = new User(id, 1)
    } else {
        cachedUser = new User(id, user[0]['status'], user[0]['username'], user[0]['guild'])
    }

    userStorage.set(id, cachedUser, 30)
    return cachedUser
}

function parseCommandsList() {
    const path = "./commands/"
    const files = fs.readdirSync(path)
    const list = new Map()

    for (const file of files) {
        const command = require("." + path + file)

        list.set(command.info.name, command)

        for (const alias of command.info.aliases) {
            list.set(alias, command)
        }
    }

    return list
}

function log(message) {
    if (config.bot.debug) console.log(message)
}

module.exports = {newMessage, userStorage}