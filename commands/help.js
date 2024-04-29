const fs = require('fs')
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

module.exports.run = async (context, params, user) => {
    // eslint-disable-next-line node/prefer-promises/fs
    fs.readdir("./commands", async (err, files) => {
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
                if (user.canUse(3)) isSponsor = true
            }

            if (command.info.enabled && command.info.help && command.info.permission === 1 && !command.info.sponsor[0]) commands.push(`${command.info.name}${(command.info.usage.split('').length > 1) ? ' ' + command.info.usage : ''} - ${command.info.description}`)
            else if (command.info.enabled && command.info.help && user.canUse(command.info.permission) && !context.isChat && !command.info.sponsor[0]) admin.push(`${command.info.name}${(command.info.usage.split('').length > 1) ? ' ' + command.info.usage : ''} - ${command.info.description}`)
            else if (command.info.enabled && isSponsor) sponsor.push(`${command.info.name}${(command.info.usage.split('').length > 1) ? ' ' + command.info.usage : ''} - ${command.info.description}`)
        })

        const header = (context.messagePayload)
            ? ''
            : '📜 Доступные команды:'
        const body = commands.join(`\n● ${process.env.PREFIX}`)
            + sponsor.join(`\n🔸 ${process.env.PREFIX}`)
            + admin.join(`\n◎ ${process.env.PREFIX}`)
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
    })
};

module.exports.runPayload = async (context, params, user) => {
    if (params[1] && params[1] === 'binds') {
        return context.reply({
            message: `💡 Для быстрого просмотра статистики существуют сокращения для гильдии и игрового аккаунта - «@me»`
                + `\n\n📲 Добавить или изменить данные на актуальные возможные при помощи команд:`
                + `\n● /setnick <игровой никнейм>`
                + `\n● /setguild <айди>`
                + `\n\n💾 Примеры использования сокращений:`
                + `\n● /stats @me bw`
                + `\n● /guild @me`
        })
    } else {
        this.run(context, params, user)
    }
};