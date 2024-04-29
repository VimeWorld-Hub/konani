let status = false

module.exports.info = {
    name: 'example',
    update: 60,
    enabled: false
};

module.exports.run = async () => {
    try{
        if(!status) console.log(`[Konani] Задача "${module.exports.info.name}" запущена`)
        status = true
    }
    catch (e) {
        console.error(e + `\nTask: ${module.exports.info.name}`)
        status = false
    }
};

module.exports.getStatus = () => {
    return status
}