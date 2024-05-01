module.exports.info = {
    name: "Листнер новых отправок Inline-Query"
};

module.exports.run = async (context) => {
    if(config.bot.debug) log(context)
};
