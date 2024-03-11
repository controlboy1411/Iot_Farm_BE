const getUserByEmail = async (email) => {
    const sqlQuery = `select * from [User] where Email = '${email}' and Is_Deleted = 0`
    const result = await _sqlserver.query(sqlQuery)
    if (result.recordset.length > 0) {
        return result.recordset[0]
    }
    return null
}

const createNewUser = async (fullName, userName, passwordHash, roleId, address, phoneNumber, email, dateOfBirth, creatorId, isActived = 0, gender = '') => {
    const sqlQuery =
        `insert into [User] 
            (Full_Name, User_Name, Password_Hash, Role_Id, Address, Phone_Number, Email, Date_Of_Birth, Created_Time, Updated_Time, Is_Deleted, Creator_Id, Is_Actived, Gender)
        output inserted.User_Id
        values
            (N'${fullName}', '${userName}', '${passwordHash}', ${roleId}, N'${address}', '${phoneNumber}', '${email}', '${dateOfBirth}', GETDATE(), GETDATE(), 0, ${creatorId}, ${isActived}, '${gender}')`

    try {
        let userId = await _sqlserver.query(sqlQuery)
        return userId.recordset[0]?.User_Id
    } catch (e) {
        console.log('Exception white create new user: ', e?.message)
        return -1
    }
}

const getUserByUserName = async (userName) => {
    const sqlQuery = `select * from [dbo].[User] where User_Name = '${userName}' and Is_Deleted = 0`
    const result = await _sqlserver.query(sqlQuery)
    if (result.recordset.length > 0) {
        return result.recordset[0]
    }
    return null
}

const getUserById = async (userId) => {
    const sqlQuery = 
        `select 
            u.User_Id, u.Full_Name, u.Address, u.Email, u.Phone_Number, 
            u.Date_Of_Birth, u.Avatar_Img_Url, u.Created_Time, u.Is_Actived, u.Gender,
            r.Role_Name, r.Role_Id
        from [dbo].[User] as u
        join [dbo].[Role] as r on u.Role_Id = r.Role_Id
        where u.User_Id = ${userId} and u.Is_Deleted = 0 and r.Is_Deleted = 0`
    const result = await _sqlserver.query(sqlQuery)
    if (result.recordset.length > 0) {
        return result.recordset[0]
    }
    return null
}

const getListUsersPaging = async (offset, limit, search) => {
    let whereCondition = `where u.Is_Deleted = 0`
    if (search && typeof(search) === 'string') {
        whereCondition += ` and (u.Full_Name like N'%${search}%' or u.User_Name like N'%${search}%')`
    }

    const sqlQuery = 
        `select u.User_Id, u.Full_Name, u.Address, u.Email, u.Phone_Number, u.Date_Of_Birth, u.Avatar_Img_Url, u.Created_Time, r.Role_Name as Role
        from [dbo].[User] u
        join [dbo].[Role] r on u.Role_Id = r.Role_Id
        ${whereCondition} 
        order by User_Name asc
        offset ${offset} rows
        fetch next ${limit} rows only`

    const sqlCount = `select count(*) as count from [dbo].[User] u ${whereCondition}`
    const result = await Promise.all([
        _sqlserver.query(sqlQuery),
        _sqlserver.query(sqlCount)
    ])

    const dataTable = result[0].recordset
    const totalRecord = result[1].recordset[0]?.count || 0

    return {
        data: dataTable,
        total: totalRecord
    }
}

const getListUsersByFarmIdPaging = async (offset, limit, farmId = 0) => {
    let whereCondition = `where u.Is_Deleted = 0 and r.Is_Deleted = 0 and uf.Is_Deleted = 0`

    if (farmId > 0) {
        whereCondition += ` and uf.Farm_Id = ${farmId} `
    }

    const sqlQuery = 
        `select 
            u.User_Id userId, u.User_Name userName, u.Full_Name fullName, u.Address address, u.Email email, u.Phone_Number phoneNumber, 
            u.Date_Of_Birth dateOfBirth, r.Role_Name as role, u.Is_Actived status
        from [dbo].[User] u
        join [dbo].[Role] r on u.Role_Id = r.Role_Id
        join [dbo].[User_Farm] uf on uf.User_Id = u.User_Id
        ${whereCondition} 
        order by u.User_Name asc
        offset ${offset} rows
        fetch next ${limit} rows only`

    const sqlCount = 
        `select count(u.User_Id) as count 
        from [dbo].[User] u
        join [dbo].[Role] r on u.Role_Id = r.Role_Id
        join [dbo].[User_Farm] uf on uf.User_Id = u.User_Id
        ${whereCondition}`
    
    const result = await Promise.all([
        _sqlserver.query(sqlQuery),
        _sqlserver.query(sqlCount)
    ])

    const dataTable = result[0].recordset
    const totalRecord = result[1].recordset[0]?.count || 0

    return {
        data: dataTable,
        total: totalRecord
    }
}

const updateUserPassword = async (userId, newPasswordHash) => {
    const sqlQuery = `update [dbo].[User] set Password_Hash = '${newPasswordHash}', Updated_Time = GETDATE() where User_Id = ${userId}`
    try {
        await _sqlserver.query(sqlQuery)
        return 0
    } catch (e) {
        console.log('Exception white update user password: ', e?.message)
        return -1
    }
}

const updateUserById = async (data) => {
    const userId = data?.User_Id
    if (!userId) {
        return -1
    }

    let updateQuery = ''
    if (data?.Full_Name) {
        updateQuery += `Full_Name = N'${data?.Full_Name}'`
    }

    if (data?.Address) {
        updateQuery += updateQuery !== '' ? `, Address = N'${data?.Address}'` : `Address = N'${data?.Address}'`
    }

    if (data?.Date_Of_Birth) {
        updateQuery += updateQuery !== '' ? `, Date_Of_Birth = '${data?.Date_Of_Birth}'` : `Date_Of_Birth = '${data?.Date_Of_Birth}'`
    }

    if (data?.Phone_Number) {
        updateQuery += updateQuery !== '' ? `, Phone_Number = '${data?.Phone_Number}'` : `Phone_Number = '${data?.Phone_Number}'`
    }

    if (data?.Email) {
        updateQuery += updateQuery !== '' ? `, Email = '${data?.Email}'` : `Email = '${data?.Email}'`
    }

    if (data?.Role_Id) {
        updateQuery += updateQuery !== '' ? `, Role_Id = ${data?.Role_Id}` : `Role_Id = ${data?.Role_Id}`
    }

    if (data?.Is_Actived === 0 || data?.Is_Actived === 1) {
        updateQuery += updateQuery !== '' ? `, Is_Actived = ${data?.Is_Actived}` : `Is_Actived = ${data?.Is_Actived}`
    }

    if (data?.Gender) {
        updateQuery += updateQuery !== '' ? `, Gender = '${data?.Gender}'` : `Gender = '${data?.Gender}'`
    }

    if (updateQuery === '') {
        return -1
    } else {
        updateQuery += `, Updated_Time = GETDATE()`
    }

    let sqlQuery = `update [dbo].[User] set ${updateQuery} where User_Id = ${userId} and Is_Deleted = 0`
    try {
        await _sqlserver.query(sqlQuery)
        return 0
    } catch (e) {
        console.log('Exception white update user infor: ', e?.message)
        return -1
    }
}

const deleteUsers = async (userIds) => {
    if (!Array.isArray(userIds) || userIds.length === 0) {
        return -1
    }

    const sqlQuery = `update [dbo].[User] set Is_Deleted = 1 where User_Id in (${userIds.join(', ')})`

    try {
        await _sqlserver.query(sqlQuery)
        return 0
    } catch (e) {
        console.log('Exception white delete list users: ', e?.message)
        return -1
    }
}

module.exports = {
    getUserByEmail,
    getUserByUserName,
    getUserById,
    createNewUser,
    getListUsersPaging,
    getListUsersByFarmIdPaging,
    updateUserPassword,
    updateUserById,
    deleteUsers
}