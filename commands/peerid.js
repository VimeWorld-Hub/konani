module.exports.info = {
    name: 'peerid',
    usage: "",
    aliases: ['peerid'],
    description: 'peer чата',
    permission: 3,
    enabled: true,
    sponsor: [],
    help: false
};

module.exports.run = async (context) => {
    context.reply(context.peerId)
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};