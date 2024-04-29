const { VK } = require('vk-io')
const fs = require('fs')
require('dotenv').config();

const vk = new VK({
    token: process.env.BOT_TOKEN,
    apiLimit: 20,
    apiMode: "sequential",
})

module.exports.vk = vk

// const sessionManager = new SessionManager()
module.exports.tasks = []

// vk.updates.on('message_new', sessionManager.middleware)
const messages = require('./listeners/messages')
// messages.new(fakeContext)
vk.updates.on('message_new', async (context, next) => {
    // require('./listeners/message_new').run(context)
    await messages.newMessage(context)
    next()
})

vk.updates.start().catch(console.error)

fs.readdir("./tasks", (err, files) => {
    if(err) return console.error(err);

    files.forEach((file) => {
        if(!file.endsWith(".js")) return;

        let task = require(`./tasks/${file}`);
        if(!task.info.enabled) return;

        this.tasks.push(task.info.name)
        task.run()
        setInterval(function() {
            task.run()
        }, task.info.update);
    });
});