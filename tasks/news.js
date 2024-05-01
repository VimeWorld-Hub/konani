const {VK, Keyboard, Params, PhotoAttachment} = require("vk-io");
const vk = new VK({
    token: "",
    apiLimit: 20,
    apiMode: "sequential",
});

let status = false
let groups = new Map()

module.exports.info = {
    name: 'news_checker',
    update: 10000,
    enabled: false
};

module.exports.run = async () => {
    try {
        if (!status) {
            console.log(`[Konani] Задача \"${this.info.name}\" запущена`)
            for (const id of [29034706, 170072131, 181918875]) {
                const news = await this.getPosts(id)
                groups.set(id, news.count)
            }
            status = true
        }

        for(const key of groups.keys()){
            const value = groups.get(key)
            const news = await this.getPosts(key)

            if(value == news.count) return
            groups.set(key, news.count)

            let document;
            if(news.items[0].attachments){
                for(const attachment of news.items[0].attachments){
                    document = `${attachment.type}-${key}_${attachment[`${attachment.type}`].id}_${attachment[`${attachment.type}`].access_key}`
                }
            }

            this.sendAll(
                `🆕 Новый пост в @public${key}`
                + `\n🌎 Быстрый переход: https://vk.com/public${key}?w=wall${news.items[0].owner_id}_${news.items[0].id}`
                + `\n🖌 Содержание: \n${news.items[0].text}`
                + `\n\n📈 Просмотров: ${news.items[0].views.count}`
                + `\n✉️ Комментариев: ${news.items[0].comments.count}`
                + `\n👍 Лайков: ${news.items[0].likes.count}`
                + `\n📂 Репостов: ${news.items[0].reposts.count}`,
                document
            )
        }
    } catch (e) {
        console.error(e)
        status = false
    }
};

module.exports.sendAll = async (message, document) => {
    for(const id of [584536789, 368667740]){
        if(document){
            vk.api.messages.send({
                random_id: 0,
                message: message,
                user_id: id,
                attachment: document
            })
        }
        else {
            vk.api.messages.send({
                random_id: 0,
                message: message,
                user_id: id
            })
        }
    }
}

module.exports.getPosts = async (public) => {
    return await vk.api.wall.get({
        owner_id: `-${public}`,
        count: 1,
        v: '5.122',
        access_token: ''
    })
}

module.exports.getStatus = () => {
    return status
}