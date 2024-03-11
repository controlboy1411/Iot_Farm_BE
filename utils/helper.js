const constant = require("./constant")
const moment = require('moment')

const getListHouseId = () => {
    return [
        1, 2, 3, 4, 5, 6, 7, 8,
        9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24
    ]
}

const formatObjectData = (object) => {
    if (object instanceof Object) {
        const keys = Object.keys(object)
        for (const key of keys) {
            if (typeof(object[key]) == 'string') {
                object[key] = object[key].trim()
            }
        }
    }

    return object
}

const getCurrentDateVNTime = function() {
    let thisDateTime = new Date()
    let vnDateTimestamp = thisDateTime.setHours(thisDateTime.getUTCHours() + 7)
    let currentDate = moment(vnDateTimestamp).format(constant.DATE_FORMAT.YYYY_MM_DD)

    return currentDate
}

module.exports = {
    getListHouseId,
    formatObjectData,
    getCurrentDateVNTime
}