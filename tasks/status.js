const { VK } = require('vk-io')
const config = require('../config')

const vk = new VK({
    token: "",
    apiLimit: 1000 * 60 * 50,
    apiMode: "sequential",
})

let status = false

module.exports.info = {
    name: 'status',
    update: 1,
    enabled: false,
    status: false
};

module.exports.run = async () => {
    try{
        let facts = Array("Вас исключат из забега на DeathRun, если вы умрете за две секунды до начала игры",
            "На KitPvP Счастливчик может убить Крысу с одного выстрела",
            "Шанс выпадения сундука за победу на Blockparty составляет 7%",
            "VimeWorld был создан осенью 2013 года",
            "Первой мини-игрой на VimeWorld стал Annihilation",
            "Изначально проект назывался VimeCraft",
            "Первым хелпером и модератором был один человек - Okssi",
            "Основателями проекта являются Lucy и xtrafrancyz",
            "Первым сайтом, работающим с апи VimeWorld, стал VimeInfo",
            "Сайт VimeWorld.ru получил новый дизайн в 2014 году",
            "VimeWorld имеет приватное CallBack API",
            "Шаблоном прошлого форума VimeWorld - является измененный AnimeHaven v3.0",
            "У VimeWorld есть свой GitHub: https://github.com/vimeworld",
            "На VimeWorld MiniGames 75 лобби",
            "Первым игроком VimeWorld с новым ID стал 00000103alex",
            "Раньше цена разбана была статичной - 150 вимеров",
            "Сундук нуба стоит 1000 коинов",
            "Древний сундук стоит 6000 коинов",
            "Мистический сундук стоит 18000 коинов",
            "Первым сервером VimeWorld, перешедшим на 1.12, является Hoden",
            "До 9 марта 2018 года сервер MiniGames был на более старой версии Майнкрафта - 1.6.4",
            "На Модовых серверах присутствует реферальная система: за 1-го игрока, отыгравшего 24 часа, можно получить 15 вимеров",
            "До 24 ноября 2016 можно было получать 2 вимера в день за голосование",
            "На данный момент VimeWorld имеет 9 серверов: MiniGames, CivCraft, Vime, Explore, Discover, Flair, Empire, Wurst и Hoden",
            "На VimeWorld 2 главных модератора: Okssi и LexaNT",
            "На VimeWorld 2 главных администратора: Lucy и xtrafrancyz",
            "Самый дешевый питомец на VimeWorld - персона. Стоит он всего 1000 коинов",
            "Для покупки всех масок на VimeWorld понадобится 420000 коинов",
            "Для покупки всех объектов на тело понадобится 1840000 коинов")

        vk.api.status.set({
            text: facts[Math.floor(Math.random() * facts.length)],
            group_id: (config.bot.debug === true) ? config.bot.id.debug : config.bot.id.release
        })

        if(!this.info.status) console.log(`[Konani] Задача \"${module.exports.info.name}\" запущена`)
        this.info.status = true
    }
    catch (e) {
        console.error(e + `\nTask: ${module.exports.info.name}`)
        status = false
    }
};