const userRepository = require('../repositories/user.repository')
const farmRepository = require('../repositories/farm.repository')
const userFarmRepository = require('../repositories/user-farm.repository')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { ROLE_ID, RESPONSE_CODE } = require('../utils/constant')
const { ResponseService } = require('../models/response')

const register = async (data) => {
    const { farmId,  roleId, fullName, dateOfBirth, email, phoneNumber, address, userName, password, creatorId } = data
    const checkUserExist = await userRepository.getUserByEmail(email)
    if (checkUserExist) {
        return {
            resultCode: -1
        }
    }
    const saltRounds = 10
    const passwordHash = bcrypt.hashSync(password, saltRounds)
    const userIdInserted = await userRepository.createNewUser(fullName, userName, passwordHash, roleId, address, phoneNumber, email, dateOfBirth, creatorId)
    if (userIdInserted === -1) {
        return {
            resultCode: -2
        }
    }

    let insertedResult = 0
    if (Number(roleId) === ROLE_ID.MANAGER || Number(roleId) === ROLE_ID.IT) {
        insertedResult = await userFarmRepository.insertUserWithAllFarm(userIdInserted)
    } else {
        insertedResult = await userFarmRepository.insertUserFarm(userIdInserted, farmId)
    }

    if (insertedResult === -1) {
        return {
            resultCode: -2
        }
    }

    return {
        resultCode: 0
    }
}

const registerV2 = async (data, creatorId = 0) => {
    const { username, password, farmIds, roleId, status, fullName, dateOfBirth, gender, email, phoneNumber, address} = data

    const emailExist = await userRepository.getUserByEmail(email)
    if (emailExist) {
        return new ResponseService(RESPONSE_CODE.FAIL, 'Email người dùng đã tồn tại trong hệ thống!')
    }

    const usernameExist = await userRepository.getUserByUserName(username)
    if (usernameExist) {
        return new ResponseService(RESPONSE_CODE.FAIL, 'Tên người dùng đã tồn tại trong hệ thống!')
    }

    const saltRounds = 10
    const passwordHash = bcrypt.hashSync(password, saltRounds)
    const userIdInserted = await userRepository.createNewUser(fullName, username, passwordHash, roleId, address, phoneNumber, email, dateOfBirth, creatorId, Number(status), gender)
    if (userIdInserted === -1) {
        return new ResponseService(RESPONSE_CODE.FAIL, 'Thêm người dùng vào CSDL thất bại!')
    }

    let userFarmInserted = 0
    if (Number(roleId) === ROLE_ID.MANAGER || Number(roleId) === ROLE_ID.IT) {
        userFarmInserted = await userFarmRepository.insertUserWithAllFarm(userIdInserted)
    } else {
        userFarmInserted = await userFarmRepository.insertUserFarmV2(userIdInserted, farmIds)
    }

    if (userFarmInserted === -1) {
        return new ResponseService(RESPONSE_CODE.FAIL, 'Phân người dùng vào farm thất bại!')
    }

    return new ResponseService(RESPONSE_CODE.SUCCESS)
}

const login = async (username, password) => {
    // Check user exist
    const user = await userRepository.getUserByUserName(username)
    if (!user) {
        return {
            resultCode: -1
        }
    }

    // Check password hash
    const passwordHashInDb = user?.Password_Hash || ''
    const checkPassword = bcrypt.compareSync(password, passwordHashInDb)
    if (!checkPassword) {
        return {
            resultCode: -2
        }
    }

    // Generate access token
    const userFarms = await userFarmRepository.getListUserFarmByUserId(user?.User_Id)
    const farmIds = userFarms.map(userFarm => {
        return userFarm?.Farm_Id
    })

    const claim = {
        userId: user?.User_Id,
        userRole: user?.Role_Id,
        userName: user?.User_Name,
        fullName: user?.Full_Name,
        farmIds: farmIds.join(',')
    }
    const accessToken = jwt.sign(claim, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
    return {
        resultCode: 0,
        access_token: accessToken
    }
}

const changePassword = async (userName, currentPassword, newPassword) => {
    // Check user exist
    const user = await userRepository.getUserByUserName(userName)
    if (!user) {
        return {
            resultCode: -1
        }
    }

    // Check password hash
    const passwordHashInDb = user?.Password_Hash || ''
    const checkPassword = bcrypt.compareSync(currentPassword, passwordHashInDb)
    if (!checkPassword) {
        return {
            resultCode: -2
        }
    }

    // Change password
    const saltRounds = 10
    const newPasswordHash = bcrypt.hashSync(newPassword, saltRounds)
    const updatedResult = await userRepository.updateUserPassword(user?.User_Id || 0, newPasswordHash)
    if (updatedResult === -1) {
        return {
            resultCode: -3
        }
    }

    return {
        resultCode: 0
    }
}

const resetPassword = async(userId, newPassword) => {
    // Check user exist
    const user = await userRepository.getUserById(userId)
    if (!user) {
        return {
            resultCode: -1
        }
    }

    // Reset password
    const saltRounds = 10
    const newPasswordHash = bcrypt.hashSync(newPassword, saltRounds)
    const updatedResult = await userRepository.updateUserPassword(user?.User_Id || 0, newPasswordHash)
    if (updatedResult === -1) {
        return {
            resultCode: -2
        }
    }

    return {
        resultCode: 0
    }
}

module.exports = {
    register,
    registerV2,
    login,
    changePassword,
    resetPassword
}