const userRepository = require('../repositories/user.repository')
const userFarmRepository = require('../repositories/user-farm.repository')
const { ROLE_ID, RESPONSE_CODE, RESPONSE_MESSAGE } = require('../utils/constant')
const moment = require('moment')
const { ResponseService } = require('../models/response')

const getUserInfor = async (userId) => {
    const user = await userRepository.getUserById(userId)
    const listFarm = await userFarmRepository.getListFarmNameByUserId(userId)
    let farmNames = []
    listFarm.map(farm => {
        if (farm?.Farm_Name) {
            farmNames.push(farm?.Farm_Name)
        }
    })
    user.Farm = farmNames.join(', ')
    return user
}

const getUserInforV2 = async (userId) => {
    const user = await userRepository.getUserById(userId)

    if (!user) {
        return null
    }

    const listFarm = await userFarmRepository.getListFarmNameByUserId(userId)

    let result = {
        userId: user.User_Id,
        roleId: user.Role_Id,
        status: user.Is_Actived,
        fullName: user.Full_Name,
        dateOfBirth: user.Date_Of_Birth ? moment(user.Date_Of_Birth).format('YYYY-MM-DD') : '',
        gender: user.Gender,
        email: user.Email,
        phoneNumber: user.Phone_Number,
        address: user.Address,
        farmIds: listFarm?.map(farm => farm.Farm_Id) || []
    }

    return result
}

const searchUsers = async (page, size, search) => {
    const limit = Number(size)
    const offset = Number(page) * Number(size)

    const dataPaging = await userRepository.getListUsersPaging(offset, limit, search)
    let users = dataPaging.data
    users = await Promise.all(users.map(async (user) => {
        const userFarms = await userFarmRepository.getListFarmNameByUserId(user?.User_Id)
        let farm = []
        for (let userFarm of userFarms) {
            if (userFarm?.Farm_Name) {
                farm.push(userFarm?.Farm_Name)
            }
        }
        user.Farm = farm.join(', ')
        return user
    }))

    return {
        count: Math.ceil(dataPaging.total / Number(size)),
        total: dataPaging.total,
        data: users
    }
}

const searchUsersV2 = async (page, size, farmId) => {
    const limit = Number(size)
    const offset = Number(page) * Number(size)
    const dataPaging = await userRepository.getListUsersByFarmIdPaging(offset, limit, Number(farmId))

    return dataPaging
}

const updateUserInfor = async (data) => {
    const result = await userRepository.updateUserById(data)
    if (result === -1) {
        return {
            resultCode: -1
        }
    }

    try {
        const userId = data?.User_Id || 0
        await userFarmRepository.deleteUserFarmByUserId(userId)
        if (data.Farm_Id !== null && data.Farm_Id !== undefined) {
            if (Number(data.Role_Id) === ROLE_ID.IT || Number(data.Role_Id) === ROLE_ID.MANAGER) {
                await userFarmRepository.insertUserWithAllFarm(userId)
            } else {
                await userFarmRepository.insertUserFarm(userId, data.Farm_Id)
            }
        }
    } catch (e) {
        return {
            resultCode: -1
        }
    }

    return {
        resultCode: 0
    }
}

const updateUserInforV2 = async function(userId, farmIds, roleId, status, fullName, dateOfBirth, gender, email, phoneNumber, address) {
    const _userId = Number(userId)
    const user = await userRepository.getUserById(_userId)

    if (!user) {
        return new ResponseService(RESPONSE_CODE.FAIL, 'Người dùng không tồn tại trong hệ thống!')
    }

    const newInfor = {
        User_Id: _userId,
        Full_Name: fullName,
        Address: address,
        Date_Of_Birth: dateOfBirth,
        Phone_Number: phoneNumber,
        Email: email,
        Role_Id: Number(roleId),
        Is_Actived: Number(status),
        Gender: gender
    }

    // Cập nhật thông tin user
    const updatedResult = await userRepository.updateUserById(newInfor)
    if (updatedResult === -1) {
        return new ResponseService(RESPONSE_CODE.FAIL, 'Cập nhật thông tin user không thành công. Vui lòng thử lại sau!')
    }

    // Cập nhật thông tin farm của user
    let listFarm = await userFarmRepository.getListFarmNameByUserId(_userId)
    let currentFarmIdsAsc = listFarm?.map(farm => farm.Farm_Id)?.sort((a, b) => a - b) || []
    let newFarmIdsAsc = farmIds?.sort((a, b) => a - b) || []
    let canUpdateFarm = false

    if (currentFarmIdsAsc?.length !== newFarmIdsAsc?.length) {
        canUpdateFarm = true
    } else {
        for (let i = 0; i < currentFarmIdsAsc?.length; i++) {
            if (currentFarmIdsAsc[i] !== newFarmIdsAsc[i]) {
                canUpdateFarm = true
                break
            }
        }
    }

    if (canUpdateFarm) {
        const deletedResult = await userFarmRepository.deleteUserFarmByUserId(_userId)
        if (deletedResult === -1) {
            return new ResponseService(RESPONSE_CODE.FAIL, 'Cập nhật thông tin farm của user không thành công. Vui lòng thử lại sau!')
        }
    
        const updatedResult2 = await userFarmRepository.insertUserFarmV2(_userId, farmIds)
        if (updatedResult2 === -1) {
            return new ResponseService(RESPONSE_CODE.FAIL, 'Cập nhật thông tin farm của user không thành công. Vui lòng thử lại sau!')
        }
    }

    return new ResponseService(RESPONSE_CODE.SUCCESS)
}

const deleteUsers = async (userIds) => {
    const result = await userRepository.deleteUsers(userIds)
    if (result === -1) {
        return {
            resultCode: -1
        }
    }
    return {
        resultCode: 0
    }
}

module.exports = {
    getUserInfor,
    getUserInforV2,
    searchUsers,
    searchUsersV2,
    updateUserInfor,
    updateUserInforV2,
    deleteUsers
}