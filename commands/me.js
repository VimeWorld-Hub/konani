const mysql = require('../libs/mysql')
const config = require('../config')
const VW = require('../libs/vimelibrary')

const VimeLibrary = new VW.Guild(config.vimeworld.dev_token)
const vk = require('../index').vk


module.exports.info = {
    name: 'me',
    usage: "",
    aliases: ['me', 'я', 'ми', 'ме'],
    description: "информация, которую знает о Вас бот",
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    try {
        const info = await mysql.execute('SELECT * FROM users WHERE id = ?', [context.senderId])

        const guild = (info[0].guild !== -1) ? (await VimeLibrary.get(info[0].guild, 'id')).name : 'Отсутствует'
        const username = (info[0].username != '-1' && info[0].username != 'null') ? info[0].username : 'Отсутствует'
        const user_name = await vk.api.users.get({user_id: context.message.from_id})

        context.reply({
            message: `●━━━━∘ [id${context.message.from_id}|${user_name[0].first_name} ${user_name[0].last_name}] ∘━━━━●`
                + `\n\n🔧 Префикс: ${info[0].prefix}`
                //+ `\n⌚  Смайлик: 🍕`
                + `\n\n👨‍💻 Никнейм: ${username}`
                + `\n🏹 Гильдия: ${guild}`,
            disable_mentions: 1,
            dont_parse_links: 1
        })
    } catch (e) {
        console.error(e)
        context.reply(`⚠ При выполнении команды произошла ошибка\n\n${e}`)
    }
};

module.exports.runPayload = async (context) => {
    try {
        await this.run(context)
    } catch (e) {
        console.error(e)
        context.reply(`⚠ При выполнении команды произошла ошибка\n\n${e}`)
    }
};