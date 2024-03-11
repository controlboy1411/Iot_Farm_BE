const express = require('express')
const router = express.Router()
const constant = require('../utils/constant')
const reportService = require('../services/report.service')

router.get('/summary-data', async (req, res) => {
    try {
        const { farmId, houseId, fromDate, toDate } = req.query
        const result = await reportService.getSummaryDataReport(farmId, houseId, fromDate, toDate)

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        }) 
    } catch (e) {
        console.log('Exception at router /report/summary-data: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/daily-livestock/import', async (req, res) => {
    try {
        const result = await reportService.importDailyLivestockReport(req.body)
        if (result.resultCode === constant.RESPONSE_CODE.FAIL) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: result.message || constant.RESPONSE_MESSAGE.FAIL,
            }) 
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
        }) 
    } catch (e) {
        console.log('Exception at router /report/daily-livestock/import: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/daily-livestock/list', async (req, res) => {
    try {
        const result = await reportService.getListDailyLivestockReport(req.query)

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        }) 
    } catch (e) {
        console.log('Exception at router /report/daily-livestock/list: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/daily-livestock/review', async (req, res) => {
    try {
        const result = await reportService.reviewDailyLivestockReport(req.body)
        if (result.resultCode === constant.RESPONSE_CODE.FAIL) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: result.message || constant.RESPONSE_MESSAGE.FAIL,
            }) 
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
        }) 
    } catch (e) {
        console.log('Exception at router /report/daily-livestock/review: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/daily-livestock/statistic', (req, res) => {
    try {
        

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: []
        }) 
    } catch (e) {
        console.log('Exception at router /report/daily-livestock/statistic: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

module.exports = router