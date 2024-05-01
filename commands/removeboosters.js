const mysql = require('../libs/mysql')
const {Keyboard} = require("vk-io");

module.exports.info = {
    name: 'removeboosters',
    usage: "<игроки через пробел>",
    aliases: ['rboosters', 'rboost', 'removeboosters'],
    description: 'удаление бустеров без добавления в игнор',
    permission: 2,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, delim) => {
    try {
        if (!delim) delim = context.text.split(" ")

        if (!delim[1]) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${delim[0]} ${this.info.usage}`)

        await mysql.execute('DELETE FROM `boosters` WHERE usernames = ?', [delim.slice(1).join(' ')])
        context.reply({
            message: '✅ Все сохраненные матчи, где участвовали эти игроки, удалены',
            keyboard: Keyboard.builder()
                .textButton({
                    label: "Список",
                    payload: "fboost"
                })
                .inline()
        })
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
}

module.exports.runPayload = async (context) => {
    const delim = context.messagePayload.split(':')
    this.run(context, delim)
}