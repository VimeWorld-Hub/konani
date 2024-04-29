const VW = require('../libs/vimelibrary')
const config = require('../config')
const axios = require('axios')
const {Keyboard} = require('vk-io')
const moment = require('moment')

const VimeLibrary = new VW.Total(config.vimeworld.dev_token)
const VimeUtils = new VW.Utils()

module.exports.info = {
    name: 'guild',
    usage: "<гильдия>",
    aliases: ['guild', 'g', 'гилд', 'гильдия', 'г'],
    description: 'информация о гильдии',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, params) => {
    params[1] = params.slice(1).join(' ')

    if (params.length < 2) {
        context.send({
            message: `🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${params[0]} <гильдия>`,
            reply_to: context.message.id
        });
        return
    }


    let inv = ""
    let type = ""
    let type_friendly = ""

    switch ((params[1].charAt(0))) {
        case "+":
            params[1] = params[1].split("+")[1]
            type = "name";
            type_friendly = "названия";
            break;
        case "-":
            params[1] = params[1].split("-")[1]
            type = "tag";
            type_friendly = "тега";
            break;
        case "=":
            params[1] = params[1].split("=")[1]
            type = "id";
            type_friendly = "айди";
            break;
        default:
            inv = "\n\n⚠️ Возможно, Вы видите информацию о другой гильдии, поскольку не уточнили, по какому из параметров идет поиск: для повышения точности, используйте префиксы: +название, =айди, -тег"
            if (params[1].match(/^[0-9]+$/)) {
                type = "id";
                type_friendly = "айди";
            } else if (params[1].split("").length <= 5) {
                type = "tag";
                type_friendly = "тега";
            } else {
                type = "name";
                type_friendly = "названия";
            }
            break;
    }

    const response = await VimeLibrary.Guild.get(encodeURIComponent(params[1]), type)

    let officers = 0
    let players = 0
    let leader;
    if (response && response.id) {
        await VimeUtils.rankCache(config.vimeworld.dev_token)
        for (let i = 0; i !== response.members.length; i++) {
            if (response.members[i].status === "LEADER") {
                const rank = await VimeUtils.getRank(response.members[i].user.rank)
                leader = `${(rank.prefix.split('').length >= 1) ? `[${rank.prefix}] ` : ``}${response.members[i].user.username}`
            } else if (response.members[i].status === "OFFICER") {
                officers += 1;
            } else if (response.members[i].status === "MEMBER") {
                players += 1;
            }
        }

        let members = response.members;
        members.sort((prev, next) => next.guildCoins - prev.guildCoins)
        let rank = await VimeUtils.getRank(members[0].user.rank, config.vimeworld.dev_token)
        let top_coins = `${(rank.prefix.split('').length >= 1) ? `[${rank.prefix}] ` : ``}${members[0].user.username} (${members[0].guildCoins})`;
        members.sort((prev, next) => next.guildExp - prev.guildExp);
        rank = await VimeUtils.getRank(members[0].user.rank, config.vimeworld.dev_token)
        let top_exp = `${(rank.prefix.split('').length >= 1) ? `[${rank.prefix}] ` : ``}${members[0].user.username} (${members[0].guildExp})`;

        let tag = (response.tag !== null)
            ? `<${response.tag}> `
            : "";

        let perks = [""]

        for (const perk in response.perks) {
            perks.push(`${response.perks[perk].name}: ${response.perks[perk].level}`)
        }

        // let info = await mysql.execute(`SELECT * FROM guilds WHERE id = ?`, [response.id])
        // const {session} = context;
        // let views = 0

        // if (!session[response.id]) mysql.execute(`UPDATE guilds SET views = views+1 WHERE id = ?`, [response.id])
        // session[response.id] = true
        // if (!info[0]) {
        //     await mysql.execute(`insert into guilds(id) values(?)`, [response.id])
        // } else {
        //     info[0].views + 1
        // }
        context.send({
            message: `🏹 ${tag}${response.name}`
                + `\nЛидер: ${leader}`
                + `\n\n👮‍♂ Офицеров: ${officers}`
                + `\n👨‍💻 Участников: ${players}`
                + `\n\n🔪 Лучший инвестор опыта: ${top_exp}`
                + `\n💸 Лучший инвестор коинов: ${top_coins}`
                + `\n\n🏷 ID: ${response.id}`
                + `\n🔮 Уровень: ${response.level}`
                // + `\n\n👀 Просмотров: ${views}`
                + `\n\n📅 Дата создания: ${moment.unix(response.created).format("DD.MM.YYYY")}`
                + `\n💰 Вложено коинов: ${response.totalCoins}`
                + `\n└ В вимерах: ${Math.floor(response.totalCoins / 250)}`
                + `\n⚔️ Заработано опыта: ${response.totalExp}`
                + `\n\n🛒 Перки:`
                + perks.join("\n● ")
                + inv,
            reply_to: context.message.id,
            dont_parse_links: 1,
            keyboard: Keyboard.builder()
                /*.textButton({
                    label: "👍🏻 0",
                    payload: `guild:${response.id}:web_info`,
                    color: Keyboard.POSITIVE_COLOR
                })
                .textButton({
                    label: "👎🏻 0",
                    payload: `guild:${response.id}:web_info`,
                    color: Keyboard.NEGATIVE_COLOR
                })
                .row()*/
                .textButton({
                    label: "🎫 Описание",
                    payload: `guild:${response.id}:web_info`,
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "🏅 Топы",
                    payload: `guild:${response.id}:tops`,
                    color: Keyboard.PRIMARY_COLOR
                })
                .row()
                .textButton({
                    label: "👮‍♂ Офицеры",
                    payload: `guild:${response.id}:officers`,
                    color: Keyboard.PRIMARY_COLOR
                })
                .textButton({
                    label: "👨‍💻 Участники",
                    payload: `guild:${response.id}:members`,
                    color: Keyboard.PRIMARY_COLOR
                })
                .row()
                .urlButton({
                    label: "🌐 Профиль VimeWorld",
                    url: `https://vimeworld.com/guild/${response.name}`,
                    color: Keyboard.NEGATIVE_COLOR
                })
                .inline(),
        })
    } else {
        if (type !== 'id') {
            context.send({
                message: `🔎 Такой гильдии не существует.\n\nЕсли вы не уверены в правильности ${type_friendly}, то можете воспользоваться командой /guildSearch (/gs)`,
                reply_to: context.message.id,
                dont_parse_links: 1,
            })
        } else {
            context.send({
                message: `🔎 Такой гильдии не существует.\n\nДля поиска по ключевым словам, можете воспользоваться командой /gs`,
                reply_to: context.message.id,
                dont_parse_links: 1,
            })
        }
    }
};

module.exports.runPayload = async (context, params) => {
    if (params[1] === 'view') {
        params[1] = `=${params[2]}`
        return this.run(context, params)
    }
    const response = await VimeLibrary.Guild.get(encodeURIComponent(params[1]), "id")

    if (!response.id) return context.reply(`🔎 Гильдия пропала`)

    let officers = ""
    let officers_count = 0
    let members = ""
    let members_count = 0

    await VimeUtils.rankCache(config.vimeworld.dev_token)
    for (const member of response.members) {
        let rank = (await VimeUtils.getRank(member.user.rank)).prefix
        switch (member.status) {
            case 'OFFICER':
                officers_count += 1
                officers += `\n● ${(rank.split('').length >= 1) ? `[${rank}] ` : ``}${member.user.username}. Коинов: ${member.guildCoins}, опыта: ${member.guildExp}`
                break;
            case 'MEMBER':
                members_count += 1
                members += `\n● ${(rank.split('').length >= 1) ? `[${rank}] ` : ``}${member.user.username}. Коинов: ${member.guildCoins}, опыта: ${member.guildExp}`
                break;
        }
    }

    switch (params[2]) {
        case 'web_info':
            if (response.web_info == null) {
                return context.reply({
                    message: `🎫 Описание у гильдии «${response.name}» отсутствует`,
                    dont_parse_links: 1,
                })
            }
            return context.reply({
                message: `🎫 Описание гильдии «${response.name}»:\n\n${response.web_info.replace(/<[^>]+>/g, '')}\n\n📜 Символов: ${response.web_info.split("").length}`,
                dont_parse_links: 1,
            })
        case 'tops':
            return await new Promise(() => {
                const promise1 = axios.get(`https://api.vimeworld.com/leaderboard/get/guild/level?size=1000`, {
                    params: {
                        token: config.vimeworld.dev_token
                    }
                });
                const promise2 = axios.get(`https://api.vimeworld.com/leaderboard/get/guild/total_coins?size=1000`, {
                    params: {
                        token: config.vimeworld.dev_token
                    }
                });

                Promise.all([promise1, promise2]).then(function (values) {
                    let top_level = "";
                    let top_coins = "";
                    for (let i = 0; i !== values[0].data.records.length; i++) {
                        if (values[0].data.records[i].name == response.name) {
                            top_level = `\n● Топ по уровню - ${i + 1} место`
                        }
                    }
                    /********/
                    for (let i = 0; i !== values[1].data.records.length; i++) {
                        if (values[1].data.records[i].name == response.name) {
                            top_coins = `\n● Топ по вложенным коинам - ${i + 1} место`
                        }
                    }
                    if (top_coins == "" && top_level == "") {
                        context.send({
                            message: `🏅 Гильдия «${response.name}» не находится ни в одном из топов.`,
                            reply_to: context.message.id,
                            dont_parse_links: 1,
                        })
                    } else {
                        context.send({
                            message: `🏅 Гильдия «${response.name}» находится в следующих топах:\n${top_coins}${top_level}`,
                            reply_to: context.message.id,
                            dont_parse_links: 1,
                        })
                    }
                })
            })
        case 'officers':
            return context.reply(`👮‍♂ Офицеры гильдии «${response.name}»:\n${officers}\n\n📃 Всего офицеров: ${officers_count}`)
        case 'members':
            return context.reply(`👨‍💻 Участники гильдии «${response.name}»:\n${members}\n\n📃 Всего участников: ${members_count}`)
        default:
            params[1] = `${params[1]}`
            return this.run(context, context.messagePayload.split(':'))
    }
};