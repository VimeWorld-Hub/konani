const {Keyboard} = require('vk-io')
const axios = require('axios')

module.exports.info = {
    name: 'm_info',
    usage: "",
    aliases: ['info_m', 'm_info', 'м_инфо', 'minfo', 'минфо', 'инфом', 'инфо_м'],
    description: 'описание Модовых серверов VimeWorld',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, params) => {
    try {
        if (!params[1]) {
            context.send({
                message: `📊 Выберите Модовый сервер, информацию о котором Вы хотите просмотреть:`,
                reply_to: context.message.id,
                keyboard: Keyboard.builder()
                    .textButton({
                        label: "Vime",
                        payload: `m_info:vime`,
                        color: Keyboard.PRIMARY_COLOR
                    })
                    .textButton({
                        label: "Explore",
                        payload: `m_info:explore`,
                        color: Keyboard.PRIMARY_COLOR
                    })
                    .row()
                    .textButton({
                        label: "Discover",
                        payload: `m_info:discover`,
                        color: Keyboard.PRIMARY_COLOR
                    })
                    .textButton({
                        label: "Empire",
                        payload: `m_info:empire`,
                        color: Keyboard.PRIMARY_COLOR
                    })
                    .row()
                    .textButton({
                        label: "Wurst",
                        payload: `m_info:wurst`,
                        color: Keyboard.PRIMARY_COLOR
                    })
                    .textButton({
                        label: "Flair",
                        payload: `m_info:flair`,
                        color: Keyboard.PRIMARY_COLOR
                    })
                    .row()
                    .textButton({
                        label: "Hoden",
                        payload: `m_info:hoden`,
                        color: Keyboard.PRIMARY_COLOR
                    })
                    .inline(),
            })
            return
        }
        const servers = await axios.get(`http://launcher.vimeworld.com/data/servers.php`)
        params = params[1]
        const info = {
            vime: {
                smile: "🛸",
                name: "Vime",
                base: "SkyTech",
                pvp: "PvE",
                version: servers.data[2].version,
                host: servers.data[2].host,
                port: servers.data[2].port,
                desc: "Выживать в открытом мире легко - много свободной территории и изобилие ресурсов. Но на Vime все по-другому: здесь ваше приключение привязано к личному острову.",
                violations: `https://forum.vimeworld.com/forum/10-vime/`,
                idea: `https://forum.vimeworld.com/forum/91-vime/`,
                personal: `https://forum.vimeworld.com/forum/24-vime/`,
            },
            explore: {
                smile: "✨",
                name: "Explore",
                base: "Galactic",
                //pvp: servers.data[3].desc.replace(/<[^>]+>/g,'').trim().split("\n")[2].split(" ")[3],
                pvp: "PvP",
                version: servers.data[3].version,
                host: servers.data[3].host,
                port: servers.data[3].port,
                desc: "Стройте космические станции, создавайте ракеты, путешествуйте по галактике в поисках инопланетных ресурсов.",
                violations: `https://forum.vimeworld.com/forum/12-explore/`,
                idea: `https://forum.vimeworld.com/forum/93-explore/`,
                personal: `https://forum.vimeworld.com/forum/26-explore/`,
            },
            discover: {
                smile: "📲",
                name: "Discover",
                base: "Hi-Tech",
                pvp: servers.data[4].desc.replace(/<[^>]+>/g, '').trim().split("\n")[2].split(" ")[3],
                version: servers.data[4].version,
                host: servers.data[4].host,
                port: servers.data[4].port,
                desc: servers.data[4].desc.replace(/<[^>]+>/g, '').trim().split("\n")[1] + " " + servers.data[4].desc.replace(/<[^>]+>/g, '').trim().split("\n")[3],
                violations: `https://forum.vimeworld.com/forum/13-discover/`,
                idea: `https://forum.vimeworld.com/forum/94-discover/`,
                personal: `https://forum.vimeworld.com/forum/27-discover/`,
            },
            empire: {
                smile: "💫",
                name: "Empire",
                base: "Magic",
                //pvp: servers.data[5].desc.replace(/<[^>]+>/g,'').trim().split("\n")[2].split(" ")[3],
                pvp: "PvP",
                version: servers.data[5].version,
                host: servers.data[5].host,
                port: servers.data[5].port,
                desc: servers.data[5].desc.replace(/<[^>]+>/g, '').trim().split("\n")[1],
                violations: `https://forum.vimeworld.com/forum/15-empire/`,
                idea: `https://forum.vimeworld.com/forum/95-empire/`,
                personal: `https://forum.vimeworld.com/forum/29-empire/`,
            },
            wurst: {
                smile: "🐱",
                name: "Wurst",
                base: "Pixelmon",
                pvp: servers.data[6].desc.replace(/<[^>]+>/g, '').trim().split("\n")[3].split(" ")[3],
                version: servers.data[6].version,
                host: servers.data[6].host,
                port: servers.data[6].port,
                desc: servers.data[6].desc.replace(/<[^>]+>/g, '').trim().split("\n")[1] + " " + servers.data[6].desc.replace(/<[^>]+>/g, '').trim().split("\n")[2],
                violations: `https://forum.vimeworld.com/forum/54-wurst/`,
                idea: `https://forum.vimeworld.com/forum/96-wurst/`,
                personal: `https://forum.vimeworld.com/forum/52-wurst/`,
            },
            flair: {
                smile: "🔨",
                name: "Flair",
                base: "TConstruct",
                pvp: "PvE",
                version: servers.data[7].version,
                host: servers.data[7].host,
                port: servers.data[7].port,
                desc: servers.data[7].desc.replace(/<[^>]+>/g, '').trim().split("\n")[1],
                violations: `https://forum.vimeworld.com/forum/11-flair/`,
                idea: `https://forum.vimeworld.com/forum/92-flair/`,
                personal: `https://forum.vimeworld.com/forum/25-flair/`,
            },
            hoden: {
                smile: "💐",
                name: "Hoden",
                base: "Classic",
                pvp: servers.data[8].desc.replace(/<[^>]+>/g, '').trim().split("\n")[3].split(" ")[3],
                version: servers.data[8].version,
                host: servers.data[8].host,
                port: servers.data[8].port,
                desc: servers.data[8].desc.replace(/<[^>]+>/g, '').trim().split("\n")[1],
                violations: `https://forum.vimeworld.com/forum/66-hoden/`,
                idea: `https://forum.vimeworld.com/forum/97-hoden/`,
                personal: `https://forum.vimeworld.com/forum/69-hoden/`,
            },
        }

        if (!info[params.toLowerCase()]) {
            return context.send({
                message: `💔 Сервера не существует`,
                reply_to: context.message.id,
            })
        }

        context.send({
            message: `${info[params.toLowerCase()].smile} {${info[params.toLowerCase()].pvp}} ${info[params.toLowerCase()].name}`
                + `\nВерсия: ${info[params.toLowerCase()].version}`
                + `\nРежим: ${info[params.toLowerCase()].base}`
                // + `\nСледующий рестарт: ${restart}\n`
                + `\n\n🎫 Описание: ${info[params.toLowerCase()].desc}`
                + `\n💻 IP: ${info[params.toLowerCase()].host}:${info[params.toLowerCase()].port}`
                + `\n\n📂 Разделы:`
                + `\n● Жалобы: ${info[params.toLowerCase()].violations}`
                + `\n● Идеи: ${info[params.toLowerCase()].idea}`
                + `\n● Заявки: ${info[params.toLowerCase()].personal}`,
            reply_to: context.message.id,
            dont_parse_links: true,
        })
    } catch (e) {
        context.reply(`⚠ При выполнении команды произошла ошибка.\n\n${e}`)
    }
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};