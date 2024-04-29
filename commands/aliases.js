const fs = require('fs')
const Mess = require('../libs/messages')

module.exports.info = {
    name: 'aliases',
    usage: "",
    aliases: ['aliases', 'алиасы', 'алиас', 'варианты'],
    description: 'варианты написания команд',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, delim, user) => {
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
                    if (context.peerId === command.info.sponsor[i]) isSponsor = true
                }
                if (user.canUse(3)) isSponsor = true
            }

            if (command.info.enabled && command.info.help && command.info.permission === 1 && !command.info.sponsor[0]) commands.push(`${command.info.name}: ${command.info.aliases.slice(1).join(', ')}`)
            else if (command.info.enabled && command.info.help && user.canUse(command.info.permission) && !context.isChat && !command.info.sponsor[0]) admin.push(`${command.info.name}: ${command.info.aliases.slice(1).join(', ')}`)
            else if (command.info.enabled && isSponsor) sponsor.push(`${command.info.name}${(command.info.usage.split('').length > 1) ? ' ' + command.info.usage : ''}: ${command.info.aliases.slice(1).join(', ')}`)
        })

        const header = (context.messagePayload)
            ? ''
            : '📜 Доступные вариации команд:'
        const body = commands.join(`\n● ${process.env.PREFIX}`)
            + sponsor.join(`\n🔸 ${process.env.PREFIX}`)
            + admin.join(`\n◎ ${process.env.PREFIX}`)
        const footer = ``

        const mess = new Mess.Message(header, body, footer)

        context.reply({
            message: await mess.get()
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
    this.run(context, context.messagePayload.split(':'))
};