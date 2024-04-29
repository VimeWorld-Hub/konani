const VW = require('../libs/vimelibrary')
const config = require('../config')
const {Keyboard} = require("vk-io");

const VimeLibrary = new VW.Total(config.vimeworld.dev_token)

module.exports.info = {
    name: 'top_g',
    usage: "<сортировка>?",
    aliases: ['top_g', 'njg_u', 'ещз_п', 'топ_г'],
    description: 'просмотр топ-100 гильдий',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, params) => {
    try {
        if (!params[1]) {
            return context.reply({
                message: `Выберите топ гильдий:`,
                keyboard: Keyboard.builder()
                    .textButton({
                        label: "Коины",
                        payload: `top_g:coins`,
                        color: Keyboard.PRIMARY_COLOR
                    })
                    .textButton({
                        label: "Уровень (опыт)",
                        payload: `top_g:level`,
                        color: Keyboard.PRIMARY_COLOR
                    })
                    .inline(),
            })
        }

        let res


        switch (params[1]) {
            case 'c':
            case 'coins':
            case 'к':
            case 'коины':
                res = await VimeLibrary.Leaderboard.get('guild', 'total_coins', 100)
                break
            case 'l':
            case 'level':
            case 'уровень':
            case 'о':
            case 'e':
            case 'exp':
                res = await VimeLibrary.Leaderboard.get('guild', 'level', 100)
                break
        }

        let u = 'totalCoins'
        let u_r = 'Коинов'
        let u_t = 'коинам'
        if (res.leaderboard.sort === 'level') {
            u = 'level'
            u_r = 'Уровень'
            u_t = 'уровню'
        }
        let n = 0
        const list = []
        for (const guild of res.records) {
            n++
            list.push(`${n}. ${guild.name}. ${u_r}: ${guild[u]}`)
        }

        context.reply({
            message: `🏅 Топ гильдий по ${u_t}:\n`
                + list.slice(0, 51).join('\n'),
            dont_parse_links: true
        })

        setTimeout(() => {
            context.send({
                message: list.slice(51, list.length).join('\n'),
                dont_parse_links: true
            })
        }, 10)
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
}

module.exports.runPayload = async (context) => {
    const delim = context.messagePayload.split(':')
    this.run(context, delim)
}