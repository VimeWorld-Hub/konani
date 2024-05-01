const VW = require('../libs/vimelibrary')
const mysql = require('../libs/mysql')
const moment = require('moment')
const config = require('../config')

const VimeLibrary = new VW.Total('')

let status = false

module.exports.info = {
    name: 'boost',
    update: 5000,
    enabled: false
};

module.exports.run = async () => {
    try {
        if (!status) {
            console.log(`[Konani] Задача \"${this.info.name}\" запущена`)
            status = true
        }

        // const matches = await VimeLibrary.Match.latest()
        // if (!matches || !matches[0]) return

        const matches = await getMatches();
        if (!matches) return;

        for (const match of matches) {
            if (match.duration <= 30) {
                const ad = await VimeLibrary.Match.get(match.id)

                if (ad?.owned || ad?.game.toLowerCase().startsWith('os')) return

                const list = []

                if (ad?.events?.length >= 1) {
                    if (ad.game.toLowerCase() == 'duels' && ad.events[0].type == 'kill' && ad.events[0].killerHealth != '20.0' && ad.events[0].killerHealth != '19.0' && ad.events[0].killerHealth != '18.0') return
                }

                if (ad?.players?.length <= 1) return
                for (const pl of ad.players) {
                    const player = await VimeLibrary.User.get(pl.id, 'id')
                    const bl = await mysql.execute('SELECT * FROM `bl_boosters` WHERE `username` = ?', [player[0].username])

                    if (ad.players.length == 2 && bl[0] && bl[0].username) return
                    list.push(player[0].username)
                }
                try {
                    await mysql.execute('INSERT INTO `boosters`(`usernames`, `matchId`, `date`) VALUES (?, ?, ?)', [list.join(' '), match.id, moment().format('DD.MM.YYYY')])
                    if (config.bot.debug) console.log(ad.game, list.join(' '), ad.winner)
                } catch (e) {

                }
            }
        }
    } catch (e) {
        console.error(e + `\nЗадача ${module.exports.info.name} завалена`)
        status = false
    }
};

async function getMatches() {
    try {
        const response = await VimeLibrary.Match.latest();

        if (!response || response.length < 1) return false;

        return response;
    } catch (e) {
        return false;
    }
}

module.exports.getStatus = () => {
    return status
}
