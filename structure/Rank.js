class Rank {
    id = 0
    ranks = {
        0: "Гость",
        1: "Пользователь",
        2: "Модератор",
        3: "Администратор"
    }

    constructor(id = 0) {
        this.id = id;
    }

    toString() {
        return this.ranks[this.id]
    }
}

module.exports = {Rank}