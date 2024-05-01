const config = require('../config')
const VW = require('../libs/vimelibrary')

const VimeLibrary = new VW.Misc(config.vimeworld.dev_token)
const VimeUtils = new VW.Utils()

module.exports.info = {
    name: 'games',
    usage: "",
    aliases: ['games', 'игры', 'написания'],
    description: 'список доступных игр',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    try {
        const games = await VimeLibrary.games();
        const list = [''];

        for (const game of games) {
            const aliases = VimeUtils.getGamesAliases(game?.id, true);
            list.push(`${game?.name}: ${(aliases) ? aliases : 'ещё не добавлены'}`);
        }

        context.reply({
            message: `🃏 Доступные игры:\n${list.join('\n● ')}\n\n📃 Всего: ${list.length-1}`
        });
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`);
    }
};

module.exports.runPayload = async (context) => {
    this.run(context);
};