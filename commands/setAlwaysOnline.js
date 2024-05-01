const {Keyboard} = require('vk-io')
const config = require('../config')

const vk = require('../index').vk

module.exports.info = {
    name: 'setalwaysonline',
    usage: "",
    aliases: ['всегдаонлайн', 'alwaysonline', 'setalwaysonline'],
    description: "отметка «В сети» для ЛС бота",
    permission: 5,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    if (context.messagePayload) {
        const delim = context.messagePayload.split(':')
        switch (delim[1]) {
            case 'true':
                vk.api.groups.enableOnline({
                    group_id: (config.bot.debug === true) ? config.bot.id.debug : config.bot.id.release
                })
                context.reply({
                    message: "✔️Включено"
                })
                break
            case 'false':
                vk.api.groups.disableOnline({
                    group_id: (config.bot.debug === true) ? config.bot.id.debug : config.bot.id.release
                })
                context.reply({
                    message: "✖️Выключено"
                })
                break
        }
        return
    }
    const delim = context.text.split(' ')
    context.reply({
        message: "🚨 Выберите статус:",
        keyboard: Keyboard.builder()
            .textButton({
                label: "Включить",
                payload: `setalwaysonline:true`,
                color: Keyboard.POSITIVE_COLOR
            })
            .textButton({
                label: "Выключить",
                payload: `setalwaysonline:false`,
                color: Keyboard.NEGATIVE_COLOR
            })
            .inline()
    })
};

module.exports.runPayload = async (context) => {
    try {
        await this.run(context)
    } catch (e) {
        console.error(e)
        context.reply(`При выполнении команды произошла ошибка`)
    }
};