const config = require('./config')
const { VK } = require('vk-io')
const { SessionManager } = require('@vk-io/session')
const fs = require('fs')

const vk = new VK({
    token: (config.bot.debug === true) ? config.bot.token.debug : config.bot.token.release,
    apiLimit: 20,
    apiMode: "sequential",
})

module.exports.vk = vk

const sessionManager = new SessionManager()
module.exports.tasks = []

vk.updates.on('message_new', sessionManager.middleware)
vk.updates.on('message_new', async (context, next) => {
    require('./listeners/message_new').run(context)
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