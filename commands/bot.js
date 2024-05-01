const mysql = require('../libs/mysql')
const config = require('../config')
const axios = require('axios')
const vimeLibrary = require('../libs/vimelibrary')
const {tasks} = require('../index')
const {Keyboard} = require("vk-io");

const VimeLibrary = new vimeLibrary.User(config.vimeworld.dev_token)

module.exports.info = {
    name: 'bot',
    usage: "",
    aliases: ['bot', 'бот', 'ботяра'],
    description: "общие сведения о текущем процессе бота",
    permission: 5,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    const pingVKTime = Date.now()
    try {
        await axios.get('https://api.vk.com')
    } catch (e) {

    }
    const pingVKDone = Date.now() - pingVKTime

    const pingVWTime = Date.now()
    let data;
    try {
        data = await VimeLibrary.get('xtrafrancyz', 'nick')
    } catch (e) {
        console.error(`[${Date.now() / 1000}] API VimeWorld is down`)
    }

    const pingVWDone = Date.now() - pingVWTime

    const users = (await mysql.execute('SELECT COUNT(*) FROM users'))[0]['COUNT(*)']
    const chats = (await mysql.execute('SELECT COUNT(*) FROM chats'))[0]['COUNT(*)']

    context.reply({
        message: `●━━━━∘ Konani ${config.bot.version} ∘━━━━●\n`
            + `\n🔋 NodeJS: ${process.version}`
            + `\n🖨 Запущенные задачи: ${(tasks.length) > 0 ? tasks.join(', ') : 'отсутствуют'}`
            + `\n\n🐩 Пинг ВК: ${pingVKDone}мс`
            + `\n🌀 Пинг VW: ${pingVWDone}мс`
            + `\n\n👩🏻‍💻 Пользователей: ${users}`
            + `\n👥 Бесед: ${chats}`
            + `\n\n👁 Осталось запросов: ${data?.token?.remaining}`
            + `\n🔨 Лимит токена: ${data?.token?.limit}`
            + `\n🔬 Ресет: ${data?.token?.reset}`,
        keyboard: Keyboard.builder()
            .inline()
            .textButton({
                label: "📊 Обновить",
                payload: this.info.name,
                color: Keyboard.SECONDARY_COLOR
            })
    })
};

module.exports.runPayload = async (context) => {
    try {
        await this.run(context)
    } catch (e) {
        console.error(e)
        context.reply(`⚠ При выполнении команды произошла ошибка`)
    }
};