const {Rank} = require("./Rank");

class User {
    id
    rank

    username
    guildId

    constructor(id = 0, rank = 1, username = null, guildId = null) {
        this.id = id
        this.rank = new Rank(rank)
        this.username = username
        this.guildId = guildId
    }

    getUsername = () => {
        return this.username
    }
    getGuildId = () => {
        return this.guildId
    }

    canUse = (needPermission) => {
        return needPermission <= this.rank.id
    }

    isGroup = () => {
        return this.id < 0
    }
}

module.exports = {User}