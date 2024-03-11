const express = require('express')
const router = express.Router()
const constant = require('../utils/constant')
const dashboardService = require('../services/dashboard.service')

router.get('/transfer-page', (req, res) => {
    try {
        const currentHouseId = req.query.houseId || ''
        const result = dashboardService.getTransferPageInfor(currentHouseId)
        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        }) 
    } catch (e) {
        console.log('Exception at router /dashboard/transfer-page: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/status-bar-data', async (req, res) => {
    try {
        const currentHouseId = req.query.houseId || ''
        const result = await dashboardService.getStatusBarData(currentHouseId)
        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        }) 
    } catch (e) {
        console.log('Exception at router /dashboard/status-bar-data: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/line-chart-data', async (req, res) => {
    try {
        const houseId = req.body.houseId || 0
        const timeLines = req.body.timeLines || []
        const distance = req.body.distance || 0
        const result = await dashboardService.getLineChartData(houseId, timeLines, distance)
        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        })
    } catch (e) {
        console.log('Exception at router /dashboard/line-chart-data: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/line-chart-data-v2', async (req, res) => {
    try {
        const houseId = req.body.houseId || 0
        const selectedDate = req.body.selectedDate || ''
        const result = await dashboardService.getLineChartDataV2(houseId, selectedDate)
        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        })
    } catch (e) {
        console.log('Exception at router /dashboard/line-chart-data-v2: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/data-table', async (req, res) => {
    try {
        let dataPaging = await dashboardService.getDataTable(req.query)

        if (dataPaging && dataPaging.data && Array.isArray(dataPaging.data)) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
                data: dataPaging
            }) 
        }
        
        return res.status(constant.HTTP_STATUS_CODE.BAD_REQUEST).json({
            code: constant.RESPONSE_CODE.NOT_FOUND,
            message: constant.RESPONSE_MESSAGE.NOT_FOUND
        })
    } catch (e) {
        console.log('Exception at router /dashboard/data-table: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/house-infor', async (req, res) => {
    try {
        const { houseId } = req.query
        const result = await dashboardService.getHouseInformation(houseId)
        if (!result) {
            return res.status(constant.HTTP_STATUS_CODE.BAD_REQUEST).json({
                code: constant.RESPONSE_CODE.NOT_FOUND,
                message: constant.RESPONSE_MESSAGE.NOT_FOUND
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        })
    } catch (e) {
        console.log('Exception at router /dashboard/house-infor: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

module.exports = router