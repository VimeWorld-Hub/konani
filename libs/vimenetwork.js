const Messages = require('./messages')
const mysql = require('./mysql')
const axios = require('axios')

class Socket{
    async connect(){
        const io = require('socket.io-client')('wss://', {
            auth: {
                token: this.token
            }
        });

        io.on("connect", (socket) => {
            console.log(`[Lonity] Connected to VimeNetwork`)
            this.created = true
        });

        io.on("connect_error", console.error);


        io.on("user_joined", async (data) => {
            console.log(data.userSession)
            const list = await mysql.execute("SELECT * FROM follows_players WHERE player = ?", data.userSession.username)
            if(!list) return

            const player = data.userSession
            const rank = await new vimelibrary.Utils().getRank(player.rank)

            let message = `📲 Игрок ${rank.prefix} ${player.username} зашёл в игру.\n└ Текущая активность: ${player.online.message}`
            for(let i = 0; i !== list.length; i++){
                vk.send(list[i]['vk'], message)
            }
        });

        io.on("user_leaved", async (data) => {
            console.log(data)

            const list = await mysql.execute("SELECT * FROM follows_players WHERE player = ?", data.userSession.username)
            if(!list) return

            const player = data.userSession
            const rank = await new vimelibrary.Utils().getRank(player.rank)

            let message = `📲 Игрок ${rank.prefix} ${player.username} вышел из игры.\n└ Провел в игре: ${data.played.general / 1000} сек.`
            for(let i = 0; i !== list.length; i++){
                vk.send(list[i]['vk'], message)
            }
        });

        io.on("guild_member_new", (data) => console.log(data));

        io.on("guild_member_status", (data) => console.log(data));

        io.on("guild_transfer", (data) => console.log(data));

        io.on("guild_member_leave", (data) => console.log(data));

        io.on("guild_disband", (data) => console.log(data));

        io.on("guild_deposit", async (data) => {
            console.log(data)
            const list = await mysql.execute("SELECT * FROM follows_guilds WHERE guild = ?", data.id)
            if(!list) return
            const guild = await new vimelibrary.Guild().get(data.id, "id")
            const player = await new vimelibrary.User().get(data.member_id, "id")

            let coins = "коинов"
            if(data.coins == 1){
                coins = "коин"
            }
            else if(data.coins == 2 || data.coins == 3 || data.coins == 4){
                coins = "коина"
            }

            const rank = await new vimelibrary.Utils().getRank(player[0].rank)

            let totalCoins = 0

            for(let i = 0; i !== guild.members.length; i++){
                if(guild.members[i].user.username == player[0].username) totalCoins = guild.members[i].guildCoins
            }

            let message = `💸 Игрок ${rank.prefix} ${player[0].username} вложил в гильдию «${guild.name}» ${data.coins} ${coins}.\n└ Общий вклад: ${totalCoins}`
            for(let i = 0; i !== list.length; i++){
                vk.send(list[i]['vk'], message)
            }
        });
    }
}

class Guild{
    constructor(method, data) {
        this.method = method
        this.data = data
        this.runned = false
        this.mess = new Messages.Bot()
    }

    async execute(){
        if(!this.data || !this.method) return console.error("[Konani] Ошибка в использовании метода Guild.execute")

        switch (this.method) {
            case 'guild_exp_take':
                await this.guild_exp_take()
                break;
            case 'guild_exp_give':
                break;
            case 'guild_rename':
                break;
            case 'guild_member_new':
                break;
            case 'guild_member_status':
                break;
            case 'guild_transfer':
                break;
            case 'guild_member_leave':
                break;
            case 'guild_disband':
                break;
            case 'guild_tag':
                break;
            case 'guild_color':
                break;
            case 'guild_deposit':
                break;
            case 'guild_perk_upgrade':
                break;
        }
    }

    async guild_exp_take(){
        await this.mess.send(1, '123')
    }

    async getMethod(){
        return this.method
    }

    async getRunned(){
        return this.runned
    }
}

class User{
    getMethod(){

    }
}

class Follow{
    async addPlayer(id, follower){
        if(!id) return console.error("[Lonity] Необходимо указать ID игрока, которого Вы хотите добавить в слежку")
        await mysql.execute(`insert into follows_players(player, follower) values(?, ?)`, [id, follower])

        return await axios.post({
            url: "https://user/follow",
            params: {token: config.vimeworld.vimenetwork_token},
            data: {userId: id},
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

    async getPlayer(id){
        if(!id) return console.error("[Lonity] Необходимо указать ID игрока, чьих подписчиков Вы хотите получить")
        const follows = await mysql.execute(`SELECT * FROM follows_players WHERE player = ?`, [id])
    }

    async addGuild(id, follower){
        if(!id) return console.error("[Lonity] Необходимо указать ID гильдии, которую вы хотите добавить")
        await mysql.execute(`insert into follows_guilds(guild, follower) values(?, ?)`, [id, follower])
    }

    async getGuild(id){
        if(!id) return console.error("[Lonity] Необходимо указать ID гильдии, чьих подписчиков Вы хотите получить")
        const follows = await mysql.execute(`SELECT * FROM follows_guilds WHERE guild = ?`, [id])
    }
}

module.exports = { User, Guild, Follow }