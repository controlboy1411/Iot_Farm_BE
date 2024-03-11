const constant = require('../utils/constant')
const moment = require('moment')
const transactionRepo = require('../repositories/transaction.repository')
const maintenanceReportRepo = require('../repositories/maintenance-report.repository')
const { ResponseService } = require('../models/response')

const getSummaryDataReport = async function(farmId, houseId, fromDate, toDate) {
    let _fromDate = ''
    let _toDate = ''

    if (fromDate) {
        _fromDate = moment(new Date(fromDate)).format(constant.DATE_FORMAT.YYYY_MM_DD)
    }

    if (toDate) {
        _toDate = (new Date(toDate)).setDate(new Date(toDate).getDate() + 1)
        _toDate = moment(_toDate).format(constant.DATE_FORMAT.YYYY_MM_DD)
    }

    const result = []

    const summaryData = await Promise.all([
        transactionRepo.getSummaryDataOfEachColumn('Temperature', houseId, _fromDate, _toDate),
        transactionRepo.getSummaryDataOfEachColumn('Humidity', houseId, _fromDate, _toDate),
        transactionRepo.getSummaryDataOfEachColumn('CO2', houseId, _fromDate, _toDate),
        transactionRepo.getSummaryDataOfEachColumn('NH3', houseId, _fromDate, _toDate),
        transactionRepo.getSummaryDataOfEachColumn('Wind_Speed', houseId, _fromDate, _toDate),
        transactionRepo.getSummaryDataOfEachColumn('Light_Intensity', houseId, _fromDate, _toDate)
    ])
    
    result.push({
        desc: 'maxValue', 
        temp: Number(summaryData[0].max_value || 0).toFixed(2), 
        humi: Number(summaryData[1].max_value || 0).toFixed(2), 
        co2: Number(summaryData[2].max_value || 0).toFixed(2), 
        nh3: Number(summaryData[3].max_value || 0).toFixed(2), 
        windSpeed: Number(summaryData[4].max_value || 0).toFixed(2), 
        lightIntensity: Number(summaryData[5].max_value || 0).toFixed(2)
    })
    result.push({
        desc: 'maxValueTime', 
        temp: summaryData[0].max_value_time, 
        humi: summaryData[1].max_value_time, 
        co2: summaryData[2].max_value_time, 
        nh3: summaryData[3].max_value_time, 
        windSpeed: summaryData[4].max_value_time, 
        lightIntensity: summaryData[5].max_value_time
    })
    result.push({
        desc: 'minValue', 
        temp: Number(summaryData[0].min_value || 0).toFixed(2), 
        humi: Number(summaryData[1].min_value || 0).toFixed(2), 
        co2: Number(summaryData[2].min_value || 0).toFixed(2), 
        nh3: Number(summaryData[3].min_value || 0).toFixed(2), 
        windSpeed: Number(summaryData[4].min_value || 0).toFixed(2), 
        lightIntensity: Number(summaryData[5].min_value || 0).toFixed(2)
    })
    result.push({
        desc: 'minValueTime', 
        temp: summaryData[0].min_value_time, 
        humi: summaryData[1].min_value_time, 
        co2: summaryData[2].min_value_time, 
        nh3: summaryData[3].min_value_time, 
        windSpeed: summaryData[4].min_value_time, 
        lightIntensity: summaryData[5].min_value_time
    })
    result.push({
        desc: 'avgValue', 
        temp: Number(summaryData[0].avg_value || 0).toFixed(2), 
        humi: Number(summaryData[1].avg_value || 0).toFixed(2), 
        co2: Number(summaryData[2].avg_value || 0).toFixed(2), 
        nh3: Number(summaryData[3].avg_value || 0).toFixed(2), 
        windSpeed: Number(summaryData[4].avg_value || 0).toFixed(2), 
        lightIntensity: Number(summaryData[5].avg_value || 0).toFixed(2)
    })
    result.push({
        desc: 'numOfOverRange', 
        temp: 0, 
        humi: 0, 
        co2: 0, 
        nh3: 0, 
        windSpeed: 0, 
        lightIntensity: 0
    })

    return result
}

const importDailyLivestockReport = async function(data) {
    const { farmId, houseId, roosterDie, henDie, roosterRemove, henRemove, roosterFeedMass, henFeedMass, 
        totalEgg, selectEgg, overSizeEgg, underSizeEgg, deformedEgg, dirtyEgg, beatenEgg, brokenEgg, creatorId } = data

    const result = await maintenanceReportRepo.insertReport(farmId, houseId, roosterDie, henDie, roosterRemove, henRemove, roosterFeedMass, henFeedMass, 
        totalEgg, selectEgg, overSizeEgg, underSizeEgg, deformedEgg, dirtyEgg, beatenEgg, brokenEgg, creatorId)

    if (result.rowsAffected[0] === 0) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Đã có lỗi xảy ra. Vui lòng thử lại sau')
    }
    return new ResponseService(constant.RESPONSE_CODE.SUCCESS)
}

const reviewDailyLivestockReport = async function(data) {
    const { reportId, reportStatus, reviewerId } = data
    const result = await maintenanceReportRepo.reviewReport(reportId, reportStatus, reviewerId)
    if (result.rowsAffected[0] === 0) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Đã có lỗi xảy ra. Vui lòng thử lại sau')
    }
    return new ResponseService(constant.RESPONSE_CODE.SUCCESS)
}

const getListDailyLivestockReport = async function(data) {
    const { page, size, farmId, houseId, reportDate, status } = data    // reportDate: DD-MM-YYYY

    const offset = Number(page) * Number(size)
    const limit = Number(size)

    const result = await maintenanceReportRepo.searchLivestockReport(offset, limit, farmId, houseId, reportDate, status)
    return result
}

const getDailyLivestockStatistic = async function() {

}

module.exports = {
    getSummaryDataReport,
    importDailyLivestockReport,
    reviewDailyLivestockReport,
    getListDailyLivestockReport,
    getDailyLivestockStatistic
}