## @VimeWorld-Hub/Konani
Абсолютный говнокод, который лень фиксить

## Config 1
```dotenv
#DATABASE
MYSQl_HOST="127.0.0.1"
MYSQL_USER="root"
MYSQL_PASSWORD=""
MYSQL_DATABASE="konani"

#BOT INFORMATION
BOT_TOKEN=""
BOT_ID=207131791

#VIMEWORLD
VIMEWORLD_DEV_TOKEN=""

#BOT SETTINGS
PATCH="2.1"
PREFIX="/"
TASKS=[]
```
## Config 2
```javascript
const os = require('os')

//https://oauth.vk.com/authorize?client_id=7920480&display=page&scope=offline, status&response_type=token&v=5.130

module.exports = {
    mysql: {
        host: "127.0.0.1",
        user: "root",
        database: "konani",
        password: ""
    },
    bot: {
        "version": "2.0",
        "debug": os.hostname() !== "beautiful-power.aeza.network",
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
        dev_token: ""
    }
}
```
