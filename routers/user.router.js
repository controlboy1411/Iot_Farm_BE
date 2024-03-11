const express = require('express')
const router = express.Router()
const constant = require('../utils/constant')
const userService = require('../services/user.service')

router.get('/user-infor', async (req, res) => {
    try {
        const {userId} = req.query
        const result = await userService.getUserInfor(userId)
        if (!result) {
            return res.status(constant.HTTP_STATUS_CODE.BAD_REQUEST).json({
                code: constant.RESPONSE_CODE.NOT_FOUND,
                message: constant.RESPONSE_MESSAGE.NOT_FOUND,
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        })
    } catch (e) {
        console.log('Exception at router /user/user-infor: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/user-infor-v2', async (req, res) => {
    try {
        const { userId } = req.query
        const result = await userService.getUserInforV2(userId)

        if (!result) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.NOT_FOUND,
                message: constant.RESPONSE_MESSAGE.NOT_FOUND,
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        })
    } catch (e) {
        console.log('Exception at router /user/user-infor-v2: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/search', async (req, res) => {
    try {
        const { page, size, search } = req.query
        const result = await userService.searchUsers(page, size, search)
        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        })
    } catch (e) {
        console.log('Exception at router /user/search: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/search-v2', async (req, res) => {
    try {
        const { page, size, farmId } = req.query
        const result = await userService.searchUsersV2(page, size, farmId)
        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: result
        })
    } catch (e) {
        console.log('Exception at router /user/search-v2: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/update', async (req, res) => {
    try {
        const data = req.body
        const result = await userService.updateUserInfor(data)
        if (result.resultCode === -1) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: constant.RESPONSE_MESSAGE.FAIL,
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
        })
    } catch (e) {
        console.log('Exception at router /user/update: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/update-v2', async (req, res) => {
    try {
        const { userId, farmIds, roleId, status, fullName, dateOfBirth, gender, email, phoneNumber, address } = req.body
        const result = await userService.updateUserInforV2(userId, farmIds, roleId, status, fullName, dateOfBirth, gender, email, phoneNumber, address)
        
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
        console.log('Exception at router /user/update-v2: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/delete', async (req, res) => {
    try {
        const userIds = req.body.userIds || []
        const result = await userService.deleteUsers(userIds)
        if (result.resultCode === -1) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: constant.RESPONSE_MESSAGE.FAIL,
            })
        }
        
        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
        })
    } catch (e) {
        console.log('Exception at router /user/delete: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

module.exports = router