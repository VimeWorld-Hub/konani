const config = require('../config')
const VW = require('../libs/vimelibrary')

const VimeLibrary = new VW.Guild(config.vimeworld.dev_token)


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

module.exports.run = async (context, params, user) => {
    try {
        let guild
        try {
            guild = (user.getGuildId()) ? (await VimeLibrary.get(user.getGuildId(), 'id')).name : 'Отсутствует'
        } catch (e) {
            guild = 'Отсутствует'
        }

        context.reply({
            //`●━━━━∘ [id${context.message.from_id}|${user_name[0].first_name} ${user_name[0].last_name}] ∘━━━━●`
            message: `●━━━━∘ ${user.rank} ∘━━━━●`
                //+ `\n⌚  Смайлик: 🍕`
                + `\n\n👨‍💻 Никнейм: ${(user.getUsername()) ? user.getUsername() : 'Отсутствует'}`
                + `\n🏹 Гильдия: ${guild}`,
            disable_mentions: 1,
            dont_parse_links: 1
        })
    } catch (e) {
        console.error(e)
        context.reply(`⚠ При выполнении команды произошла ошибка\n\n${e}`)
    }
};

module.exports.runPayload = async (context, params) => {
    try {
        await this.run(context, params)
    } catch (e) {
        console.error(e)
        context.reply(`⚠ При выполнении команды произошла ошибка\n\n${e}`)
    }
};