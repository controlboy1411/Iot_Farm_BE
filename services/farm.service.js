const houseRepo = require('../repositories/house.repository')
const farmRepo = require('../repositories/farm.repository')
const { ResponseService } = require('../models/response')
const constant = require('../utils/constant')
const { getCurrentDateVNTime } = require('../utils/helper')

const addHouse = async function(farmId, houseNumber, roosterNumber, henNumber, batchNo, weekAge, status) {
    const houseExist = await houseRepo.getHouseByFarmIdAndHouseNumber(farmId, houseNumber)
    if (houseExist) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, `Chuồng số ${houseNumber} đã tồn tại ở trại`)
    }

    let activeDate = null
    if (Number(status) === 1) {
        activeDate = getCurrentDateVNTime()
    }

    let houseName = 'Chuồng ' + houseNumber
    let result = await houseRepo.insertHouse(farmId, houseName, houseNumber, Number(roosterNumber), Number(henNumber), activeDate, status, batchNo, Number(weekAge))

    if (result.rowsAffected[0] === 0) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Đã có lỗi xảy ra. Vui lòng thử lại sau')
    }

    return new ResponseService(constant.RESPONSE_CODE.SUCCESS)
}

const updateHouse = async function(farmId, houseNumber, roosterNumber, henNumber, batchNo, weekAge, status) {
    const houseExist = await houseRepo.getHouseByFarmIdAndHouseNumber(farmId, houseNumber)
    if (!houseExist) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, `Chuồng số ${houseNumber} không tồn tại ở trại`)
    }

    let activeDate = null
    if (Number(status) === 1) {
        activeDate = getCurrentDateVNTime()
    }

    let result = await houseRepo.updateHouse(farmId, houseNumber, Number(roosterNumber), Number(henNumber), activeDate, status, batchNo, Number(weekAge))
    if (result.rowsAffected[0] === 0) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Đã có lỗi xảy ra. Vui lòng thử lại sau')
    }

    return new ResponseService(constant.RESPONSE_CODE.SUCCESS)
}

const deleteHouse = async function(farmId, houseNumber) {
    let result = await houseRepo.deleteHouse(farmId, houseNumber)
    if (result.rowsAffected[0] === 0) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Đã có lỗi xảy ra. Vui lòng thử lại sau')
    }

    return new ResponseService(constant.RESPONSE_CODE.SUCCESS)
}

const getFarmInformation = async function(farmId) {
    let result = await farmRepo.getFarmById(Number(farmId))
    if (result) {
        return new ResponseService(constant.RESPONSE_CODE.SUCCESS, constant.RESPONSE_MESSAGE.SUCCESS, result)
    }
    return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Không tìm thấy thông tin farm với ID tương ứng')
}

module.exports = {
    addHouse,
    updateHouse,
    deleteHouse,
    getFarmInformation
}