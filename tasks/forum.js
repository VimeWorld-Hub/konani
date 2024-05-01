const mysql = require("../libs/mysql");
let status = false

module.exports.info = {
    name: 'forum',
    update: 5000,
    enabled: false
};

module.exports.run = async () => {
    try {
        if (!status) console.log(`[Konani] Задача \"${module.exports.info.name}\" запущена`)
        status = true

        const Parser = require('rss-parser');
        let parser = new Parser();

        let feed = await parser.parseURL('https://forum.vimeworld.ru/discover/all.xml/');
        for(const message of feed.items){
            const title = message.title
            const link = message.link
            const content = message.content.trim()

            const banWord = ['епта']
            const words = content.replace(/[\n\r]+|[\s]{2,}/g, '').split(' ')
            for(const word of words){
                try{
                    const res = await mysql.execute('SELECT * FROM bl_words WHERE word = ?', [word.toLowerCase()])
                    if(res[0]){
                        console.log(link, ban)
                    }
                }
                catch (e) {
                    
                }
            }
        }
        return
        for(const message of feed.items){
            console.log(message)
            const title = message.title
            const link = message.link
            const content = message.content.trim()

            const banWord = ['конкурс']

            const words = content.split()
            for(const word of words){

                for(const bnn of banWord){
                    if(word.trim().toLowerCase() == bnn.toLowerCase()){
                        console.log(word)
                    }
                }
            }
            return
            for(const word of banWord){
                if(content.toLowerCase().includes(word))
                    console.log(content.toLowerCase().includes(word))
                    console.log(content)
                    //await mysql.execute('INSERT INTO `forum`(`link`, `title`, `content`) VALUES (?, ?, ?)', [link, title, content])
            }
        }
    } catch (e) {
        console.error(e + `\nЗадача ${module.exports.info.name} завалена`)
        status = false
    }
};

module.exports.getStatus = () => {
    return status
}