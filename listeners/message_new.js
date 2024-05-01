const mysql = require('../libs/mysql')
const fs = require('fs')
const config = require('../config')

module.exports.info = {
    name: "Листнер новых сообщений"
};

module.exports.run = async (context) => {
    if (config.bot.debug || context.senderId === 584536789) log(context)
    if (context.conversationMessageId === 2) return require(`../commands/start`).run(context)

    if (context.messagePayload) return new Buttons().execute(context)
    else return new Commands().execute(context)
};

class Buttons {
    async execute(context) {
        try {
            const cmd = context.messagePayload.command || context.messagePayload.text || context.messagePayload || context.messagePayload.user_command || ""
            const delim = cmd.split(':')

            let user = await (new User).get(context.senderId)
            if (!user[0]) await (new User).add(context.senderId)
            user = await (new User).get(context.senderId)
            fs.readdir("./commands", (err, files) => {
                if (err) return console.error(err);

                files.forEach((file) => {
                    if (!file.endsWith(".js")) return;

                    let command = require(`../commands/${file}`);
                    let aliases = command.info.aliases

                    for (let i = 0; i < aliases.length; i++) {
                        if (delim[0].toLowerCase() === aliases[i].toLowerCase() && command.info.enabled)
                            if (command.info.permission <= user[0].status) return command.runPayload(context)
                            else return context.reply(`🔒 У вас недостаточно прав для этого действия`)
                    }
                });
            });
        } catch (e) {

        }
    }
}

class Commands {
    async execute(context) {
        if (!context.text) return
        const delim = context.text.split(' ')

        //const {session} = context;

        /*if (!session.info[context.senderId]) {
            session.info[context.senderId] = [0, Date.now()];
        }

        session.info[context.senderId][0] += 1

        if (session.info[context.senderId][1] / 1000 <= Date.now() / 1000 - (60 * 1000)) session.info[context.senderId][1] = Date.now()
        if (session.info[context.senderId][0] === 40) return context.send("🤯 Превышен лимит по использованию команд бота в минуту. Дальнейшие сообщения (пока лимит не спадет) будут игнорироваться.")
        else if (session.info[context.senderId][0] > 40) return*/

        try {
            if (context.isChat) {
                let group = await new Chat().get(context.peerId)
                if (!group[0]) await new Chat().add(context.peerId)
                group = await new Chat().get(context.peerId)

                let user = await new User().get(context.senderId)
                if (!user[0]) await new User().add(context.senderId)
                user = await new User().get(context.senderId)

                const prefix = group[0].prefix
                const usedPrefix = (prefix.split("").length >= 2) ? delim[0].split("")[0] + delim[0].split("")[1] : delim[0].split("")[0]

                if (prefix !== usedPrefix) return

                fs.readdir("./commands", (err, files) => {
                    if (err) return console.error(err);

                    files.forEach((file) => {
                        if (!file.endsWith(".js")) return;

                        let command = require(`../commands/${file}`)
                        let aliases = command.info.aliases

                        for (let i = 0; i < aliases.length; i++) {
                            if (delim[0].toLowerCase() === prefix + aliases[i] && command.info.enabled) {
                                if (command.info.permission <= user[0].status)
                                    if (command.info.sponsor.length < 1) return command.run(context)
                                    else {
                                        for (let i = 0; i !== command.info.sponsor.length; i++) {
                                            if (context.peerId == command.info.sponsor[i] || user[0].status >= 3) return command.run(context)
                                        }
                                        return
                                    }
                                else return context.reply(`🔒 У вас недостаточно прав для этого действия`)
                            }
                        }
                    });
                });
            } else {
                let user = await new User().get(context.senderId)
                if (!user[0]) await new User().add(context.senderId)
                user = await new User().get(context.senderId)

                const prefix = (user[0] && user[0].prefix) ? user[0].prefix : '/'
                const usedPrefix = (prefix.split("").length >= 2) ? delim[0].split("")[0] + delim[0].split("")[1] : delim[0].split("")[0]

                if (usedPrefix !== prefix) return;

                fs.readdir("./commands", (err, files) => {
                    if (err) return console.error(err);

                    files.forEach((file) => {
                        if (!file.endsWith(".js")) return;

                        let command = require(`../commands/${file}`)
                        let aliases = command.info.aliases

                        for (let i = 0; i < aliases.length; i++) {
                            if (delim[0].toLowerCase() === prefix + aliases[i] && command.info.enabled) {
                                if (command.info.permission <= user[0].status)
                                    if (command.info.sponsor.length < 1)
                                        return command.run(context)
                                    else {
                                        for (let i = 0; i !== command.info.sponsor.length; i++) {
                                            if (context.peerId == command.info.sponsor[i] || user[0].status >= 3) return command.run(context)
                                        }
                                        return
                                    }
                                else return context.reply(`🔒 У вас недостаточно прав для этого действия`)
                            }
                        }
                    });
                });
            }
            return true
        } catch (e) {
            if (e) console.error(e)
            context.reply(`🔎 При выполнении команды \"${delim[0]}\" произошла ошибка :c`)
            return false
        }
    }
}

class User {
    async get(id) {
        return await mysql.execute(`SELECT * FROM users WHERE id = ?`, [id])
    }

    async add(id) {
        await mysql.execute(`insert into users(id) values(?)`, [id])
    }
}

class Chat {
    async add(id) {
        return await mysql.execute(`insert into chats(id) values(?)`, [id])
    }

    async get(id) {
        return await mysql.execute(`SELECT * FROM chats WHERE id = ?`, [id])
    }
}

function log(context) {
    console.log(context)
}