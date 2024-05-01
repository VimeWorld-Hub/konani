const VW = require('../libs/vimelibrary')
const config = require('../config')

const mysql = require('../libs/mysql')
const {Keyboard} = require("vk-io");

module.exports.info = {
    name: 'addboosters',
    usage: "",
    aliases: ['aboosters', 'aboost', 'addboosters'],
    description: 'поиск бустеров',
    permission: 2,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, delim) => {
    try {
        if (!delim) delim = context.text.split(" ")

        if (!delim[1]) return context.reply('null')

        for (let i = 1; i !== delim.length; i++) {
            const isdup = await mysql.execute('SELECT * FROM `bl_boosters` WHERE username = ?', [delim[i]])
            if (isdup[0] && isdup[0].username) continue
            await mysql.execute('INSERT INTO `bl_boosters`(`username`) VALUES (?)', [delim[i]])
        }

        await mysql.execute('DELETE FROM `boosters` WHERE usernames = ?', [delim.slice(1).join(' ')])
        context.reply({
            message: '✅ Игроки добавлены в игнор бустеров',
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