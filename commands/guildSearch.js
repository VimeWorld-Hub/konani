const VW = require('../libs/vimelibrary')
const Mess = require('../libs/messages')
const config = require('../config')
const {Keyboard} = require('vk-io')

const VimeLibrary = new VW.Guild(config.vimeworld.dev_token)

module.exports.info = {
    name: 'gs',
    usage: "<ключевая фраза для поиска>",
    aliases: ['gs', 'гс', 'guildsearch', 'гильдияпоиск', 'поискг'],
    description: 'поиск гильдий по ключевой фразе',
    permission: 1,
    enabled: true,
    sponsor: [],
    help: true
};

module.exports.run = async (context, params) => {
    if (!params[1]) return context.reply(`🔎 Вы забыли один из аргументов этой команды.\n\nПравильное использование: ${params[0]} <ключевая фраза для поиска>`)

    if (params[1].split('').length < 2) {
        context.send({
            message: `🔍 Запрос для поиска должен быть длинее 2-ух символов.`,
            reply_to: context.message.id
        });
        return
    }

    const data = await VimeLibrary.search(encodeURIComponent(params[1]))
    if (data.length < 1) return context.reply(`🔍 Гильдий по запросу «${params[1]}» - не найдено`)

    const g = ['']

    for (const k of data) {
        g.push(`${(k.tag) ? `<${k.tag}>` : ``} ${k.name}`)
    }

    const header = (context.messagePayload)
        ? ''
        : `🔍 Гильдии по запросу «${params[1]}»:\n\n`
    const body = g.join("\n● ")
    const footer = `\n\n📃 Всего: ${g.length}`

    const mess = new Mess.Message(header, body, footer)
    context.reply({
        message: await mess.get(),
        keyboard: Keyboard.builder()
            .textButton({
                label: "📊 Обновить",
                payload: `${this.info.name}:${params[1]}`,
                color: Keyboard.SECONDARY_COLOR
            })
            .inline()
    })
};

module.exports.runPayload = async (context) => {
    this.run(context, context.messagePayload.split(':'))
};