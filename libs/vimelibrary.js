const axios = require("axios")
const moment = require("moment")

const API_URL = "https://api.vimeworld.com"

class Request {
    async get(url, token) {
        const req = await axios.get(`${API_URL}/${url}`, {
            params: {
                token: token
            }
        });

        if (req.data.error) {
            throw `API вернул ошибку: ${req.data.error.error_msg}`;
        }

        req.data['token'] = {
            'remaining': req?.headers["x-ratelimit-remaining"],
            'limit': req?.headers["x-ratelimit-limit"],
            'reset': req?.headers["x-ratelimit-reset-after"],
        }

        if (req.data.token?.remaining <= 2) {
            console.log(`[${moment().format()} | ${token}] Закончились запросы`)
        }

        return req.data
    }

    async post(url, data) {
        const req = await axios.post(`${API_URL}/${url}`, data, {dataType: 'json',});
        return req.data
    }
}


class User {
    constructor(token) {
        this.token = token
        this.requests = new Request()
    }

    /** Получение информации об игроке */
    async get(data, by) {
        if (!data || !by) return console.error("[VimeLibrary] Один из обязательных параметров отсутствует")
        switch (by) {
            case 'nick':
            case 'nickname':
            case 'username':
            case 'name':
                return this.requests.get(`user/name/${data}`, this.token)
            case 'id':
                return this.requests.get(`user/${data}`, this.token)
        }
    }

    /** Получение друзей игрока */
    async friends(data, by) {
        if (!data || !by) return console.error("[VimeLibrary] Один из обязательных параметров отсутствует")
        switch (by) {
            case 'nick':
            case 'nickname':
            case 'username':
            case 'name':
                return this.requests.get(`user/name/${data}/friends`, this.token)
            case 'id':
                return this.requests.get(`user/${data}/friends`, this.token)
        }
    }

    /** Получение сессии игрока */
    async session(data, by) {
        if (!data || !by) return console.error("[VimeLibrary] Один из обязательных параметров отсутствует")
        switch (by) {
            case 'nick':
            case 'nickname':
            case 'username':
            case 'name':
                return this.requests.get(`user/name/${data}/session`, this.token)
            case 'id':
                return this.requests.get(`user/${data}/session`, this.token)
        }
    }

    /** Очень массовое получение статуса (до 1000) */
    async sessionBig(data) {
        if (!data) return console.error("[VimeLibrary] Необходимо указать массив поиска")
        if (!(data instanceof Array)) return console.error("[VimeLibrary] Необходимо указать именно МАССИВ поиска")
        return this.requests.post(`user/session`, data)
    }

    /** Получение статистики игрока */
    async stats(data, by) {
        if (!data || !by) return console.error("[VimeLibrary] Один из обязательных параметров отсутствует")
        switch (by) {
            case 'nick':
            case 'nickname':
            case 'username':
            case 'name':
                return this.requests.get(`user/name/${data}/stats`, this.token)
            case 'id':
                return this.requests.get(`user/${data}/stats`, this.token)
        }
    }

    /** Получение достижений игрока */
    async achievements(data, by) {
        if (!data || !by) return console.error("[VimeLibrary] Один из обязательных параметров отсутствует")
        switch (by) {
            case 'nick':
            case 'nickname':
            case 'username':
            case 'name':
                return this.requests.get(`user/name/${data}/achievements`, this.token)
            case 'id':
                return this.requests.get(`user/${data}/achievements`, this.token)
        }
    }

    /** Получение топов игрока */
    async leaderboards(data, by) {
        if (!data || !by) return console.error("[VimeLibrary] Один из обязательных параметров отсутствует")
        switch (by) {
            case 'nick':
            case 'nickname':
            case 'username':
            case 'name':
                return this.requests.get(`user/name/${data}/leaderboards`, this.token)
            case 'id':
                return this.requests.get(`user/${data}/leaderboards`, this.token)
        }
    }

    /** Получение последних матчей игрока */
    async matches(data, by) {
        if (!data || !by) return console.error("[VimeLibrary] Один из обязательных параметров отсутствует")
        switch (by) {
            case 'nick':
            case 'nickname':
            case 'username':
            case 'name':
                return this.requests.get(`user/name/${data}/matches`, this.token)
            case 'id':
                return this.requests.get(`user/${data}/matches`, this.token)
        }
    }
}

class Online {
    constructor(token) {
        this.token = token
        this.requests = new Request()
    }

    /** Получение общего онлайна на MiniGames */
    async get() {
        return this.requests.get(`online`, this.token)
    }

    /** Получение модераторов онлайн */
    async staff() {
        return this.requests.get(`online/staff`, this.token)
    }

    /** Получение стримов онлайн */
    async streams() {
        return this.requests.get(`online/streams`, this.token)
    }
}

class Misc {
    constructor(token) {
        this.token = token
        this.requests = new Request()
    }

    /** Возвращает информацию о токене */
    async getToken(data) {
        if (!data) return console.error("[VimeLibrary] Необходимо указать токен для просмотра")
        return this.requests.get(`misc/token/${data}`)
    }

    /** Список всех возможных достижений */
    async achievements() {
        return this.requests.get(`misc/achievements`, this.token)
    }

    /** Список карт, сгруппированный по играм */
    async maps() {
        return this.requests.get(`misc/maps`, this.token)
    }

    /** Список игр, по которым ведется статистика */
    async games() {
        return this.requests.get(`misc/games`, this.token)
    }
}

class Match {
    constructor(token) {
        this.token = token
        this.requests = new Request()
    }

    /** Полная информация о матче */
    async get(id) {
        return this.requests.get(`match/${id}`, this.token)
    }

    /** Список последних матчей на сервере */
    async latest() {
        return this.requests.get(`match/latest`, this.token)
    }

    /** Список матчей на сервере */
    async list() {
        return this.requests.get(`match/list`, this.token)
    }
}

class Guild {
    constructor(token) {
        this.token = token
        this.requests = new Request()
    }

    /** Получает информацию о гильдии */
    async get(data, by) {
        if (!data || !by) return console.error("[VimeLibrary] Один из необходимых аргументов (data, by) отсутствует")
        switch (by) {
            case 'id':
                return this.requests.get(`guild/get?id=${data}`, this.token)
            case 'name':
                return this.requests.get(`guild/get?name=${data}`, this.token)
            case 'tag':
                return this.requests.get(`guild/get?tag=${data}`, this.token)
            default:
                return console.error("[VimeLibrary] Неверный тип поиска, доступно: id, name, tag")
        }
    }

    /** Ищет гильдии по названию или тегу */
    async search(data) {
        if (!data) return console.error("[VimeLibrary] Необходимо указать ключевое слово/ключевые слова для поиска")
        return this.requests.get(`guild/search?query=${data}`, this.token)
    }
}

class Locale {
    constructor(token) {
        this.token = token
        this.requests = new Request()
    }

    /** Человекочитаемые названия игр, статистики, рангов */
    async get(parts = `games,game_stats,ranks`) {
        return this.requests.get(`locale/ru?parts=${parts}`, this.token)
    }
}

class Leaderboard {
    constructor(token) {
        this.token = token
        this.requests = new Request()
    }

    /** Список таблиц рекордов */
    async list() {
        return this.requests.get(`leaderboard/list`, this.token)
    }

    /** Возвращает таблицу рекордов */
    async get(type, sort, size, offset) {
        if (!size) size = 100
        if (!offset) offset = 0

        return this.requests.get(`leaderboard/get/${type}/${sort}?size=${size}&offset=${offset}`, this.token)
    }
}

class Utils {
    async rankCache() {
        this.ranks = await new Locale().get('ranks')
    }

    async rankUncache() {
        this.ranks = null
    }

    async getRank(rank, token) {
        rank = rank.toLowerCase()
        token = (token) ? token : ''
        const res = (this.ranks) ? this.ranks : await new Locale(token).get('ranks')

        if (res.error) return console.error('[VimeLibrary] Токен - это обязательный параметр (ну, я говнокод забыл доделать)')

        if (!res.ranks[rank]) return {name: rank, prefix: rank}
        else return res.ranks[rank]
    }

    async topsCache(token) {
        token = (token) ? token : ''
        this.tops = await new Leaderboard(token).list()
    }

    /** Возвращает топ для команды /top */
    async getTopStatRus(top) {
        const tops = {
            level: "Уровень",
            online: "Онлайн",
            total_coins: "Коинов",
            kills: "Убийств",
            wins: "Побед",
            bedBreaked: "Сломанных кроватей",
            total_wins: "Побед",
            total_games: "Игр",
            rate: "Рейтинг",
            total_blocks: "Вскопанных блоков",
            earned_money: "Заработанных денег",
            points: "Очков",
            wins_as_maniac: "Побед за маньяка",
            tamed_sheep: "Принесенных овечек",
            destroyed_beds: "Уничтоженных кроватей",
        }

        return (tops[top]) ? tops[top] : top
    }

    /** Возвращает топ для фразы "топ по.." */
    async getTopRus(top) {
        const tops = {
            level: "уровню",
            online: "онлайну",
            total_coins: "коинам",
            kills: "убийствам",
            wins: "победам",
            bedBreaked: "сломанным кроватям",
            total_wins: "победам",
            total_games: "играм",
            rate: "рейтингу",
            total_blocks: "вскопанным блокам",
            earned_money: "заработанным деньгам",
            points: "очкам",
            wins_as_maniac: "победам за маньяка",
            tamed_sheep: "принесенным овечкам",
            destroyed_beds: "уничтоженным кроватям",
        }

        return (tops[top]) ? tops[top] : top
    }

    /** Возвращает человекоподобный топ */
    async getTops(top, type, token) {
        token = (token) ? token : ''
        const res = (this.tops) ? this.tops : await new Leaderboard(token).list()

        for (const ar of res) {
            if (ar.type === top) {
                for (const le of ar.sort) {
                    if (le === type) {
                        const rusTop = await this.getTopRus(type)
                        let top = ar.description
                        top = top.replace('Топ', '')
                        top = top.replace('игроков на ', '')
                        top = top.replace('(в этом месяце)', 'Season')
                        top = top.replace('(в этом сезоне)', 'Season')
                        top = top.replace('Аркадах', 'Аркад')
                        top += ' по ' + rusTop
                        return top
                    }
                }
            }
        }
        return `${top}_${type}`
    }

    async gamesCache(token) {
        this.games = await new Locale(token).get('games')
    }

    async getGame(value, token) {
        value = value.toLowerCase()
        token = (token) ? token : ''

        if (value === 'swt') return 'SkyWars Team'
        else if (value === 'dr') return 'DeathRun'
        else if (value === 'bwh') return 'BedWars Hard'
        else if (value === 'bwq') return 'BedWars Quick'
        else if (value === 'bwhype') return 'BedWars Hype'
        else if (value === 'bwt') return 'BedWars Turbo'
        else if (value === 'hgl') return 'HungerGames Lucky'
        else if (value === 'lobby') return 'Лобби'
        else if (value === 'skyblock') return 'SkyBlock'

        const res = (this.games) ? this.games : await new Locale(token).get('games')

        if (!res.games[value]) return value
        else return res.games[value].name
    }

    async statsCache(token) {
        this.stats = await new Locale(token).get('game_stats')
    }

    async getStats(value, value_d, token) {
        value = value.toLowerCase()
        token = (token) ? token : ''
        const res = (this.stats) ? this.stats : await new Locale(token).get('game_stats')

        if (res.game_stats[value] && res.game_stats[value][value_d]) return res.game_stats[value][value_d]
        else return value_d
    }

    /** Возвращает игру, понятную API */
    getGamesAliases(alias, list = false) {
        if (!alias) return

        const aliases = {
            ann: ["ann", "annihilation", "ан", "аник", "анник", "анн", "анничек"],
            bb: ["bb", "билдбатл", "buildbatle", "бб"],
            bp: ["bp", "блокпати", "blockparty", "бп"],
            bw: ["bw", "бедварс", "bedwars", "бв"],
            bwt: ["bwt", "бедварст", "бвтурбо", "бвт"],
            bwhype: ["хайп", "бвхайп", "хайпик", "hype", "bwhype", "bhype", "хайпулик", "бедварсх", "бедварсхайп"],
            cp: ["cp", "clash", "клэш", "clashpoint", "клеш", "цп"],
            dr: ["dr", "дезран", "deathrun", "др"],
            duels: ["duels", "duel", "дуел", "дуэл"],
            gg: ["gg", "гангейм", "gungame", "гг"],
            hg: ["hg", "hungergames", "хангергеймс", "хг"],
            kpvp: ["kpvp", "китпвп", "кп", "kp", "kitpvp"],
            mw: ["mw", "мобварс", "мв", "mobwars"],
            prison: ["prison", "присон", "призон", "тюрьма", "приз", "прис"],
            sw: ["sw", "скайварс", "skywars", "св"],
            arc: ["arc", "аркады", "арк", "arcade", "аркаде"],
            bridge: ["bridge", "бридж", "мосты", "bridge", "зебридж", "бридже", "бридге"],
            jumpleague: ["jumpleague", "джамплига", "жамплига", "лигапрыжков", "жлига"],
            murder: ["маньяк", "murder", "мардер", "мм"],
            sheep: ["sheep", "шип", "шееп", "шипварс", "шеепварс"],
            turfwars: ["turfwars", "тюрфварс", "турф", "турфварс"],
            tnttag: ["tnttag", "тнттег", "тнттэг", "тиинтитег", "тиинтитэг"],
            tntrun: ["tntrun", "тнтран", "тиинтиран", "тинтиран", "тиэнтиран"],
            luckywars: ["luckywars", "lw", "лакиварс", "лв"],
            zombieclaus: ["zombieclaus", "зомби", "зомбимороз", "ивент", "event", "zombie", "claus", "moroz", "клаус"],
            hide: ["hide", "хайд", "хайдэндсик", "хайдэндсек", "hideand", "hideandseek"],
            speedbuilders: ["speedbuilders", "speed", "builders", "спид"],
            teamfortress: ["teamfortress", "тф", "тимфортрес", "тим", "фортресс", "tf", "team"],
            fallguys: ["fallguys", "фалгайс", "фуллгайс", "фулгайс", "фаллгайс", "фг", "fg"],
            eggwars: ["eggwars", "egg", "яйцо", "яицбитва", "битваяиц", "яйца", "яички"],
            skyblock: ["skyblock", "sb", "сб", "скайблок", "скайбл", "skyb", "bs", "бс", "небоостров"],
        }

        for (const g in aliases) {
            for (const k of aliases[g]) {
                if (alias.toLowerCase() === k) return (list) ? aliases[g] : g
            }
        }
        return null
    }
}

class Total {
    constructor(token) {
        this.User = new User(token)
        this.Online = new Online(token)
        this.Misc = new Misc(token)
        this.Utils = new Utils()
        this.Locale = new Locale(token)
        this.Guild = new Guild(token)
        this.Match = new Match(token)
        this.Leaderboard = new Leaderboard(token)
    }
}

module.exports = {User, Online, Misc, Locale, Match, Guild, Leaderboard, Utils, Total}