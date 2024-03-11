const { RESPONSE_MESSAGE, RESPONSE_CODE } = require("../utils/constant")

class ResponseService {
    constructor(resultCode = RESPONSE_CODE.SUCCESS, message = RESPONSE_MESSAGE.SUCCESS, data = null) {
        this.resultCode = resultCode
        this.message = message
        this.data = data
    }
}

module.exports = {
    ResponseService
}