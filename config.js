const os = require('os')

//https://oauth.vk.com/authorize?client_id=7920480&display=page&scope=offline, status&response_type=token&v=5.130

module.exports = {
    mysql: {
        host: "127.0.0.1",
        user: "konani",
        database: "konani",
        password: ""
    },
    bot: {
        "version": "2.0",
        "debug": os.hostname() !== "",
        "token": {
            "release": "",
            "debug": ""
        },
        "id": {
            "release": 201421071,
            "debug": 207131791
        }
    },
    vimeworld: {
        dev_token: "",
        vimeauth_token: "",
        vimenetwork_token: ""
    }
}