const express = require('express')
const router = express.Router()
const constant = require('../utils/constant')
const masterDataService = require('../services/master-data.service')

router.get('/farms', async (req, res) => {
    try {
        const masterData = await masterDataService.getAllFarms()

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: masterData
        })
    } catch (e) {
        console.log('Exception at router /master/farms: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/active-houses', async (req, res) => {
    try {
        const { farmId } = req.query
        const masterData = await masterDataService.getAllHousesByFarm(farmId)

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: masterData
        })
    } catch (e) {
        console.log('Exception at router /master/active-houses: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

module.exports = router