module.exports.info = {
    name: 'payload',
    usage: "",
    aliases: ['payload'],
    description: 'payload message',
    permission: 5,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context) => {
    if (!context.replyMessage) return context.reply('null')
    context.reply((context.replyMessage.messagePayload) ? context.replyMessage.messagePayload : "null")
};

module.exports.runPayload = async (context) => {
    this.run(context)
};