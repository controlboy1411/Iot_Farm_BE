const express = require('express')
const router = express.Router()
const constant = require('../utils/constant')
const farmService = require('../services/farm.service')

router.post('/add-house', async (req, res) => {
    try {
        const { farmId, houseNumber, roosterNumber, henNumber, batchNo, weekAge, status } = req.body
        const result = await farmService.addHouse(farmId, houseNumber, roosterNumber, henNumber, batchNo, weekAge, status)
        if (result.resultCode === constant.RESPONSE_CODE.FAIL) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: result.message || constant.RESPONSE_MESSAGE.FAIL
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS
        })
    } catch (e) {
        console.log('Exception at router /farm/add-house: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/update-house', async (req, res) => {
    try {
        const { farmId, houseNumber, roosterNumber, henNumber, batchNo, weekAge, status } = req.body
        const result = await farmService.updateHouse(farmId, houseNumber, roosterNumber, henNumber, batchNo, weekAge, status)
        if (result.resultCode === constant.RESPONSE_CODE.FAIL) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: result.message || constant.RESPONSE_MESSAGE.FAIL
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS
        })
    } catch (e) {
        console.log('Exception at router /farm/update-house: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/delete-house', async (req, res) => {
    try {
        const { farmId, houseNumber } = req.body
        const result = await farmService.deleteHouse(farmId, houseNumber)
        if (result.resultCode === constant.RESPONSE_CODE.FAIL) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: result.message || constant.RESPONSE_MESSAGE.FAIL
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS
        })
    } catch (e) {
        console.log('Exception at router /farm/delete-house: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/infor', async (req, res) => {
    try {
        const { farmId } = req.query
        const result = await farmService.getFarmInformation(farmId)
        if (result.resultCode === constant.RESPONSE_CODE.FAIL) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: result.message || constant.RESPONSE_MESSAGE.FAIL
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result.data
        })
    } catch (e) {
        console.log('Exception at router /farm/infor: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

module.exports = router