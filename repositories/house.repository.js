const sql = require('mssql')

const getHouseById = async (houseId) => {
    const sqlQuery = `select * from [dbo].[House] where House_Id = ${houseId}`
    const result = await _sqlserver.query(sqlQuery)
    if (result.recordset.length > 0) {
        return result.recordset[0]
    }
    return null
}

const searchHousesPaging = async (farmId, status, limit, offset) => {
    let whereCondition = ` f.Farm_Id = ${farmId} `
    if (status === 0 || status === 1) {
        whereCondition += ` and h.Is_Active = ${status} `
    }

    whereCondition += ' and h.Is_Deleted = 0 '

    const sqlQuery = 
        `select 
            f.Farm_Id farmId, f.Farm_Name farmName,
            h.House_Id houseId, h.House_Name houseName, h.House_Number houseNumber,
            ISNULL(h.Total_Rooster, 0) - ISNULL(h.Total_Rooster_Die, 0) as totalRooster,
            ISNULL(h.Total_Hen, 0) - ISNULL(h.Total_Hen_Die, 0) as totalHen,
            h.Batch_No batchNo, h.Week_No weekAge, h.Is_Active status
        from [dbo].[Farm] f
        join [dbo].[House] h on h.Farm_Id = f.Farm_Id
        where  ${whereCondition}
        order by h.House_Id
        offset ${offset} rows
        fetch next ${limit} rows only`

    const sqlCount = 
        `select 
            count(h.House_Id) as count
        from [dbo].[Farm] f
        join [dbo].[House] h on h.Farm_Id = f.Farm_Id
        where ${whereCondition}`

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

/**
 * Lấy thông tin master data của các house thuộc 1 farm
 * @param {*} farmId ID của farm muốn lấy ra danh sách các house
 * @param {*} activeStatus Tham số này nhận 3 giá trị: 1 (active), 0 (unactive), 2 (get all)
 */
const getMasterDataHouses = async (farmId, activeStatus = 1) => {
    const request = _sqlserver.request()
    request.input('farmId', sql.Int, farmId)

    let sqlQuery = 
        `select House_Id houseId, House_Name houseName, House_Number houseNumber 
        from House where Farm_Id = @farmId and Is_Deleted = 0`;
        
    if (activeStatus === 1 || activeStatus === 0) {
        request.input('active', sql.SmallInt, activeStatus)
        sqlQuery += ' and Is_Active = @active; '
    }

    const result = await request.query(sqlQuery)
    return result.recordset
}

const getHouseByFarmIdAndHouseNumber = async (farmId, houseNumber) => {
    const request = _sqlserver.request()
    request.input('farmId', sql.Int, farmId)
    request.input('houseNumber', sql.Int, houseNumber)

    let sqlQuery = 'select 1 from House where Farm_Id = @farmId and House_Number = @houseNumber';
    const result = await request.query(sqlQuery)
    return result.recordset[0]
}

const insertHouse = async (farmId, houseName, houseNumber, roosterNumber, henNumber, activeDate, isActive, batchNo, weekAge) => {
    const request = _sqlserver.request()
    request.input('farmId', sql.Int, farmId)
    request.input('houseName', sql.NVarChar, houseName)
    request.input('houseNumber', sql.Int, houseNumber)
    request.input('roosterNumber', sql.Int, roosterNumber)
    request.input('henNumber', sql.Int, henNumber)
    request.input('activeDate', sql.DateTime, activeDate)
    request.input('isActive', sql.SmallInt, isActive)
    request.input('batchNo', sql.VarChar, batchNo)
    request.input('weekAge', sql.Int, weekAge)

    let sqlCommand = 
        `insert into House (Farm_Id, House_Name, House_Number, Total_Rooster, Total_Hen, Active_Date, Is_Active, Batch_No, Week_No, Is_Deleted)
        values (@farmId, @houseName, @houseNumber, @roosterNumber, @henNumber, @activeDate, @isActive, @batchNo, @weekAge, 0)`;
    const result = await request.query(sqlCommand)
    return result
}

const updateHouse = async (farmId, houseNumber, roosterNumber, henNumber, activeDate, isActive, batchNo, weekAge) => {
    const request = _sqlserver.request()
    request.input('farmId', sql.Int, farmId)
    request.input('houseNumber', sql.Int, houseNumber)
    request.input('roosterNumber', sql.Int, roosterNumber)
    request.input('henNumber', sql.Int, henNumber)
    request.input('activeDate', sql.DateTime, activeDate)
    request.input('isActive', sql.SmallInt, isActive)
    request.input('batchNo', sql.VarChar, batchNo)
    request.input('weekAge', sql.Int, weekAge)

    let sqlCommand = 
        `update House
        set Total_Rooster = @roosterNumber, Total_Hen = @henNumber, Batch_No = @batchNo, Week_No = @weekAge, Active_Date = @activeDate, Is_Active = @isActive
        where Farm_Id = @farmId and House_Number = @houseNumber and Is_Deleted = 0;`;
    const result = await request.query(sqlCommand)
    return result
}

const deleteHouse = async (farmId, houseNumber) => {
    const request = _sqlserver.request()
    request.input('farmId', sql.Int, farmId)
    request.input('houseNumber', sql.Int, houseNumber)

    let sqlCommand = 
        `update House
        set Is_Deleted = 1
        where Farm_Id = @farmId and House_Number = @houseNumber and Is_Deleted = 0;`;
    const result = await request.query(sqlCommand)
    return result
}

module.exports = {
    getHouseById,
    searchHousesPaging,
    getMasterDataHouses,
    getMasterDataHouses,
    getHouseByFarmIdAndHouseNumber,
    insertHouse,
    updateHouse,
    deleteHouse
}