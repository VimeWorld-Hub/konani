const messages = require('../libs/messages')
const {Keyboard} = require('vk-io')

module.exports.info = {
    name: 'btn_menu',
    usage: "",
    aliases: ['btn_menu', 'бтн', 'меню'],
    description: 'меню кнопочек',
    permission: 3,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    if (context.messagePayload) {
        const delim = context.messagePayload.split(':')
        switch (delim[1]) {
            case 'send':
                context.reply({
                    message: `✅ Отправлено`,
                    keyboard: await (new messages.VKeyboard).getDefaultKeyboard()
                })
                break;
            case 'remove':
                context.reply({
                    message: `✅ Удалено`,
                    keyboard: Keyboard.builder()
                })
                break;
        }
        return
    }

    context.reply({
        message: `🖱 Выберите одно из действий:`,
        keyboard: Keyboard.builder()
            .textButton({
                label: "Отправить",
                payload: "btn_menu:send",
                color: Keyboard.POSITIVE_COLOR
            })
            .textButton({
                label: "Удалить",
                payload: "btn_menu:remove",
                color: Keyboard.NEGATIVE_COLOR
            })
            .inline()
    })
};

module.exports.runPayload = async (context) => {
    this.run(context)
};