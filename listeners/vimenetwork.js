const config = require('../config')
const mysql = require('../libs/mysql')
const vk = require('../index').vk
const vimeLibrary = require('../libs/vimelibrary')

const VimeLibrary = new vimeLibrary.Total(config.vimeworld.dev_token)
const VimeUtils = new vimeLibrary.Utils()

module.exports.info = {
    name: "События от WebHook API"
};
//{ id: 33739, old_leader_id: 5860149, new_leader_id: 4462193 }
// { id: 11136, old_leader_id: 6683231, new_leader_id: 6684466 }

module.exports.run = async (context) => {
    try{
        await new Socket(config.vimeworld.vimenetwork_token).create()
        console.log("[Konani] Lonity запущен")
    }
    catch (e) {
        console.error("[Konani] Lonity не запущен")
    }
};

class Socket{
    constructor(token) {
        this.token = token
        this.created = false
    }

    async create(){
        const io = require('socket.io-client')('', {
            auth: {
                token: this.token
            }
        })


        io.on("connect", (socket) => {
            this.created = true
        })

        io.on("connect_error", console.error);

        io.on("user_joined", async (data) => {
            console.log(data.userSession)
        })

        io.on("user_leaved", async (data) => {
            console.log(data)
        })

        io.on("guild_member_new", async (data) => {
            const followers = await mysql.execute("SELECT * FROM follows_guilds WHERE guild = ? OR guild = 0", [data.id])
            if(!followers[0]) return
            let message

            const guild = await VimeLibrary.Guild.get(data.id, "id")
            const player = await VimeLibrary.User.get(data.member_id, "id")
            const inviter = await VimeLibrary.User.get(data.inviter_id, "id")
            const rank = await VimeUtils.getRank(player[0].rank, config.vimeworld.dev_token)
            const rank_i = await VimeUtils.getRank(inviter[0].rank, config.vimeworld.dev_token)

            message = `🆕 Новый участник в гильдии «${guild.name}» - ${(rank.prefix.split('').length >= 1 ? `[${rank.prefix}] ` : ``)}${player[0].username}`
                + `\n└ Пригласил: ${(rank_i.prefix.split('').length >= 1 ? `[${rank_i.prefix}] ` : ``)}${inviter[0].username}`
            for(const follower of followers) {
                try {
                    await vk.api.messages.send({
                        peer_id: follower.follower,
                        random_id: 0,
                        message: message
                    })
                } catch (e) {

                }
            }
        })

        io.on("guild_member_status", async (data) => {
            const followers = await mysql.execute("SELECT * FROM follows_guilds WHERE guild = ? OR guild = 0", [data.id])
            if(followers.length < 1) return

            const guild = await VimeLibrary.Guild.get(data.id, "id")
            const player = await VimeLibrary.User.get(data.member_id, "id")
            const rank = await VimeUtils.getRank(player[0].rank, config.vimeworld.dev_token)

            let n = (data.from == "MEMBER") ? "Участник" : "Офицер"
            let b = (data.to == "MEMBER") ? "Участник" : "Офицер"

            const smile = (n === "Офицер") ? "📉" : "📈"

            const message = `${smile} Статус участника гильдии «${guild.name}» ${(rank.prefix.split('').length >= 1 ? `[${rank.prefix}] ` : ``)}${player[0].username} был изменен:`
                + `\n├ Прошлый: ${n}`
                + `\n└ Текущий: ${b}`
            for(const follower of followers) {
                try {
                    await vk.api.messages.send({
                        peer_id: follower.follower,
                        random_id: 0,
                        message: message,
                        dont_parse_links: 1
                    })
                } catch (e) {

                }
            }
        })

        io.on("guild_transfer", (data) => {
            console.log(data)
        })

        io.on("guild_member_leave", async (data) => {
            const followers = await mysql.execute("SELECT * FROM follows_guilds WHERE guild = ? OR guild = 0", [data.id])
            if(!followers[0]) return
            let reason = "выход по собственному желанию"

            const guild = await VimeLibrary.Guild.get(data.id, "id")
            const player = await VimeLibrary.User.get(data.member_id, "id")
            const rank = await VimeUtils.getRank(player[0].rank, config.vimeworld.dev_token)

            if(data.kicker_id){
                const kicker = await VimeLibrary.User.get(data.kicker_id, "id")
                const rank_k = await VimeUtils.getRank(kicker[0].rank, config.vimeworld.dev_token)

                reason = `кик игроком ${(rank_k.prefix.split('').length >= 1 ? `[${rank_k.prefix}] ` : ``)}${kicker[0].username}`
            }

            const message = `🚷 Гильдию «${guild.name}» покинул один из её участников - ${(rank.prefix.split('').length >= 1 ? `[${rank.prefix}] ` : ``)}${player[0].username}`
                + `\n└ Причина: ${reason}`
            for(const follower of followers) {
                try {
                    await vk.api.messages.send({
                        peer_id: follower.follower,
                        random_id: 0,
                        message: message
                    })
                } catch (e) {

                }
            }
        })

        io.on("guild_disband", async (data) => {
            const followers = await mysql.execute("SELECT * FROM follows_guilds WHERE guild = ? OR guild = 0", [data.id])
            if(!followers[0]) return

            const player = await VimeLibrary.User.get(data.member_id, "id")
            const rank = await VimeUtils.getRank(player[0].rank, config.vimeworld.dev_token)

            const message = `🔪 Гильдия «${data.name}» была распущена ${(rank.prefix.split('').length >= 1 ? `[${rank.prefix}] ` : ``)}${player[0].username}`

            for(const follower of followers) {
                try {
                    await vk.api.messages.send({
                        peer_id: follower.follower,
                        random_id: 0,
                        message: message
                    })
                } catch (e) {

                }
            }
        })

        io.on("guild_deposit", async (data) => {
            const followers = await mysql.execute("SELECT * FROM follows_guilds WHERE guild = ? OR guild = 0", [data.id])
            if(!followers[0]) return
            let message

            const guild = await VimeLibrary.Guild.get(data.id, "id")
            const player = await VimeLibrary.User.get(data.member_id, "id")
            const rank = await VimeUtils.getRank(player[0].rank, config.vimeworld.dev_token)

            let coins = "коинов"
            if(data.coins == 1){
                coins = "коин"
            }
            else if(data.coins == 2 || data.coins == 3 || data.coins == 4){
                coins = "коина"
            }

            let totalCoins = 0
            for(let i = 0; i !== guild.members.length; i++){
                if(guild.members[i].user.username == player[0].username) totalCoins = guild.members[i].guildCoins+data.coins
            }

            message = `💸 Игрок ${(rank.prefix.split('').length >= 1 ? `[${rank.prefix}] ` : ``)}${player[0].username} вложил в гильдию «${guild.name}» ${data.coins} ${coins}.\n└ Общий вклад: ${totalCoins}`
            for(const follower of followers) {
                try {
                    await vk.api.messages.send({
                        peer_id: follower.follower,
                        random_id: 0,
                        message: message
                    })
                } catch (e) {

                }
            }
        })
    }
}