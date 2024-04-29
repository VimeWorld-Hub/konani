const mysql = require('../libs/mysql')
const messages = require('../libs/messages')

module.exports.info = {
    name: 'start',
    usage: "",
    aliases: ['start', 'старт'],
    description: 'создание аккаунта',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: false
};

module.exports.run = async (context) => {
    if (context.isChat) return
    
    try {
        await context.send({
            message: '🔮 Приветствую, я - бот, который поможет тебе на VimeWorld\n'
                + `\nВот мои основные команды:`
                + `\n👨‍💻 /stats (/s) <никнейм> <игра>? - статистика игрока`
                + `\n👯 /friends (/f) <никнейм> - друзья игрока`
                + `\n🏅 /tops <никнейм> - список топов, в которых состоит игрок`
                + `\n🏹 /guild (/g) <+название/-тег/=айди> - информация о гильдии`
                + `\n🔍 /guildSearch (/gs) <запрос> - поиск гильдий`
                + `\n🛡 /staff - модераторы в сети`
                + `\n🎥 /streams - трансляции от ютуберов`
                + `\n🎲 /top <игра> <сортировка>? - топ мини-игры`
                + `\n🎮 /online - онлайн на сервере VimeWorld MiniGames`
                + `\n🕹 /online_m - онлайн на Модовых серверах VimeWorld`,
            keyboard: await (new messages.VKeyboard).getDefaultKeyboard()
        });
    } catch (e) {
        if (e) console.error(e)
        context.reply({
            message: `🛠 При регистрации возникла ошибка, попробуйте чуть позже`
        })
    }
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};