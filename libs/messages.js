const { Keyboard, VK } = require('vk-io')
const config = require('../config')
const mysql = require('./mysql')
const vk = new VK({
    token: (config.bot.debug === true) ? config.bot.token.debug : config.bot.token.release,
    apiLimit: 20,
    apiMode: "sequential",
})

class Message{
    constructor(header, body, footer) {
        this.header = (header) ? header : '';
        this.body = (body) ? body : '';
        this.footer = (footer) ? footer : '';
    }

    async get(){
        return `${this.header + this.body + this.footer}`
    }
}

class VKeyboard{
    async getDefaultKeyboard(){
        return Keyboard.builder()
            .textButton({
                label: "💡 Помощь",
                payload: "help",
                color: Keyboard.SECONDARY_COLOR
            })
            .textButton({
                label: "🎮 Онлайн",
                payload: "online",
                color: Keyboard.SECONDARY_COLOR
            })
            .row()
            .textButton({
                label: "🛡 Модераторы",
                payload: "staff",
                color: Keyboard.SECONDARY_COLOR
            })
            .textButton({
                label: "🎥 Стримы",
                payload: "streams",
                color: Keyboard.SECONDARY_COLOR
            });
    }
}

class Bot{
    async send(){
        await vk.api.messages.send({
            peer_id: id,
            random_id: 0,
            message: message
        })
    }
}

class User{
    async getNick(context){
        if(!context) return

        const user = await mysql.execute(`SELECT * FROM users WHERE id = ?`, [context.senderId])
        if(!user[0] || user[0].username == "-1"){
            return false
        }
        else{
            return user[0].username
        }
    }

    async getGuild(context){
        if(!context) return
    }
}

async function testUsername(username = ""){
    return /[a-zA-Z1-9_]/g.test(username)
}

module.exports = { Message, VKeyboard, Bot, User, testUsername }