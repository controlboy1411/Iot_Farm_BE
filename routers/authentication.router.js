const express = require('express')
const router = express.Router()
const constant = require('../utils/constant')
const authService = require('../services/authentication.service')

router.post('/register', async (req, res) => {
    try {
        const registerData = req.body
        const result = await authService.register(registerData)
        if (result.resultCode === -1) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: `User với email ${registerData.email} đã tồn tại trong hệ thống`,
            })
        } else if (result.resultCode === -2) {
            return res.status(constant.HTTP_STATUS_CODE.BAD_REQUEST).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: constant.RESPONSE_MESSAGE.FAIL,
            })
        } else {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS
            })
        }
    } catch (e) {
        console.log('Exception while register: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/register-v2', async (req, res) => {
    try {
        const registerData = req.body
        const result = await authService.registerV2(registerData)

        if (result.resultCode === constant.RESPONSE_CODE.FAIL) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: result.message || constant.RESPONSE_MESSAGE.FAIL,
            })
        }
        
        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS
        })
    } catch (e) {
        console.log('Exception at router /auth/register-v2: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const result = await authService.login(username, password)
        if (result.resultCode === -1) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: 'Tên đăng nhập không tồn tại',
            })
        }

        if (result.resultCode === -2) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: 'Sai mật khẩu',
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
            data: {
                accessToken: result.access_token
            }
        })
    } catch (e) {
        console.log('Exception while login: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/change-password', async (req, res) => {
    try {
        const { userName, currentPassword, newPassword } = req.body
        const result = await authService.changePassword(userName, currentPassword, newPassword)
        if (result.resultCode === -1) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: 'Tên đăng nhập không tồn tại',
            })
        }

        if (result.resultCode === -2) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: 'Mật khẩu hiện tại không chính xác',
            })
        }

        if (result.resultCode === -3) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: 'Đổi mật khẩu thất bại',
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
        })
    } catch (e) {
        console.log('Exception while change password: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/reset-password', async (req, res) => {
    try {
        const { userId, newPassword } = req.body
        const result = await authService.resetPassword(userId, newPassword)
        if (result.resultCode === -1) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: 'Người dùng không tồn tại',
            })
        }

        if (result.resultCode === -2) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.FAIL,
                message: 'Reset mật khẩu thất bại',
            })
        }
        
        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.SUCCESS,
            message: constant.RESPONSE_MESSAGE.SUCCESS,
        })
    } catch (e) {
        console.log('Exception while reset password: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})


module.exports = router