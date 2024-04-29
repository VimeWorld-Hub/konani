const {Keyboard} = require('vk-io')

class Message {
    constructor(header, body, footer) {
        this.header = (header) ? header : '';
        this.body = (body) ? body : '';
        this.footer = (footer) ? footer : '';
    }

    async get() {
        return `${this.header + this.body + this.footer}`
    }
}

class VKeyboard {
    async getDefaultKeyboard() {
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

async function testUsername(username = "") {
    return /[a-zA-Z1-9_]/g.test(username)
}

module.exports = {Message, VKeyboard, testUsername}