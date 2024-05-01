const fs = require('fs')
const mysql = require('../libs/mysql')
const Mess = require('../libs/messages')
const {Keyboard} = require('vk-io')

module.exports.info = {
    name: 'help',
    usage: "",
    aliases: ['help', 'помощь', 'хелп', 'помоги'],
    description: 'полный список команд',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: false
};

module.exports.run = async (context) => {
    const delim = context?.messagePayload?.split(":")
    if (delim && delim[1] && delim[1] === 'binds') {
        return context.reply({
            message: `💡 Для быстрого просмотра статистики существуют сокращения для гильдии и игрового аккаунта - «@me»`
                + `\n\n📲 Добавить или изменить данные на актуальные возможные при помощи команд:`
                + `\n● /setnick <игровой никнейм>`
                + `\n● /setguild <айди>`
                + `\n\n💾 Примеры использования сокращений:`
                + `\n● /stats @me bw`
                + `\n● /guild @me`
        })
    }

    fs.readdir("./commands", async (err, files) => {
        const u = await mysql.execute(`SELECT * FROM users WHERE id = ?`, [context.senderId])
        if (err) return console.error(err);
        const commands = ['']
        const admin = ['']
        const sponsor = ['']

        files.forEach((file) => {
            if (!file.endsWith(".js")) return;

            let isSponsor = false;

            let command = require(`./${file}`);

            if (command.info.sponsor[0]) {
                for (let i = 0; i !== command.info.sponsor.length; i++) {
                    if (context.peerId == command.info.sponsor[i]) isSponsor = true
                }
                if (u[0].status >= 3) isSponsor = true
            }

            if (command.info.enabled && command.info.help && command.info.permission === 1 && !command.info.sponsor[0]) commands.push(`${command.info.name}${(command.info.usage.split('').length > 1) ? ' ' + command.info.usage : ''} - ${command.info.description}`)
            else if (command.info.enabled && command.info.help && u[0].status >= command.info.permission && !context.isChat && !command.info.sponsor[0]) admin.push(`${command.info.name}${(command.info.usage.split('').length > 1) ? ' ' + command.info.usage : ''} - ${command.info.description}`)
            else if (command.info.enabled && isSponsor) sponsor.push(`${command.info.name}${(command.info.usage.split('').length > 1) ? ' ' + command.info.usage : ''} - ${command.info.description}`)
        })

        const header = (context.messagePayload)
            ? ''
            : '📜 Доступные команды:'
        const body = commands.join(`\n● ${u[0].prefix}`)
            + sponsor.join(`\n🔸 ${u[0].prefix}`)
            + admin.join(`\n◎ ${u[0].prefix}`)
        const footer = ``

        const mess = new Mess.Message(header, body, footer)

        context.reply({
            message: await mess.get(),
            keyboard: Keyboard.builder()
                .textButton({
                    label: "⚡ Бинды",
                    payload: "help:binds",
                    color: Keyboard.SECONDARY_COLOR
                })
                .inline()

        })
    });

    /*context.reply({
        message: "123",
        keyboard: Keyboard.builder()
            .callbackButton({
                label: "⚡ Бинды",
                payload: {
                    command: 'buy',
                    item: 'coffee'
                },
                color: Keyboard.SECONDARY_COLOR
            })
            .urlButton({
                label: "🌐 Тема vimeworld.com",
                url: "https://vk.cc/c4HSkz"
            })
            .inline()
    })*/
};

module.exports.runPayload = async (context) => {
    this.run(context)
};