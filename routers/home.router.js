const express = require('express')
const router = express.Router()
const constant = require('../utils/constant')
const homeService = require('../services/home.service')

router.get('/list-house', async (req, res) => {
    try {
        const farmId = Number(req.query.farmId || 0)
        let listHouse = await homeService.getListHouse(farmId)
        if (listHouse && Array.isArray(listHouse)) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
                data: listHouse
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.BAD_REQUEST).json({
            code: constant.RESPONSE_CODE.NOT_FOUND,
            message: constant.RESPONSE_MESSAGE.NOT_FOUND
        })
    } catch (e) {
        console.log('Exception while get list house: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/active-houses', async (req, res) => {
    try {
        const farmId = req.query?.farmId
        const result = await homeService.getActiveHouses(farmId)
        if (result && Array.isArray(result)) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
                data: result
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.BAD_REQUEST).json({
            code: constant.RESPONSE_CODE.NOT_FOUND,
            message: constant.RESPONSE_MESSAGE.NOT_FOUND
        })
    } catch (e) {
        console.log('Exception while get active houses: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/active', async (req, res) => {
    try {
        const result = await homeService.activeHouse(req.body)
        if (result === 1) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.BAD_REQUEST).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: constant.RESPONSE_MESSAGE.FAIL
        })
    } catch (e) {
        console.log(`Exception while active house ${req.query.houseId}: `, e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/search', async (req, res) => {
    try {
        const { page, size, farmId, status } = req.query
        const result = await homeService.searchHouses(page, size, farmId, status)
        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        })
    } catch (e) {
        console.log('Exception while get active houses: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

module.exports = router