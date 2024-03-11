const insertUserFarm = async (userId, farmId) => {
    const sqlQuery =
        `insert into User_Farm (User_Id, Farm_Id, Is_Deleted)
        values (${userId}, ${farmId}, 0)`

    try {
        await _sqlserver.query(sqlQuery)
        return 0
    } catch (e) {
        return -1
    }
}

const insertUserFarmV2 = async (userId, farmIds) => {
    let sqlQuery =
        `insert into User_Farm (User_Id, Farm_Id, Is_Deleted)
        values `

    for (let i = 0; i < farmIds.length; i++) {
        sqlQuery += ` (${userId}, ${farmIds[i]}, 0)`
        if (i < farmIds.length - 1) {
            sqlQuery += ','
        }
    }

    try {
        await _sqlserver.query(sqlQuery)
        return 0
    } catch (e) {
        return -1
    }
}

const insertUserWithAllFarm = async (userId) => {
    const sqlQuery = 
        `insert into User_Farm (User_Id, Farm_Id, Is_Deleted)
        select ${userId}, f.Farm_Id, 0
        from Farm as f`

    try {
        await _sqlserver.query(sqlQuery)
        return 0
    } catch (e) {
        return -1
    }
}

const getListUserFarmByUserId = async (userId) => {
    const sqlQuery = `select * from User_Farm where User_Id = ${userId} and Is_Deleted = 0`
    const result = await _sqlserver.query(sqlQuery)
    return result.recordset
}

const getListFarmNameByUserId = async (userId) => {
    const sqlQuery = 
        `select f.Farm_Id, f.Farm_Name
        from User_Farm as uf
        join Farm as f on uf.Farm_Id = f.Farm_Id
        where uf.User_Id = ${userId} and uf.Is_Deleted = 0`
    const result = await _sqlserver.query(sqlQuery)
    return result.recordset
}

const deleteUserFarmByUserId = async (userId) => {
    const sqlQuery = `update [dbo].[User_Farm] set Is_Deleted = 1 where User_Id = ${userId}`
    try {
        await _sqlserver.query(sqlQuery)
        return 0
    } catch (e) {
        return -1
    }
}

module.exports = {
    insertUserFarm,
    insertUserFarmV2,
    insertUserWithAllFarm,
    getListUserFarmByUserId,
    getListFarmNameByUserId,
    deleteUserFarmByUserId
}