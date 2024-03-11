const sql = require('mssql')

/**
 * Lấy thông tin master data của các farm
 * @param {*} activeStatus Tham số này nhận 3 giá trị: 1 (active), 0 (unactive), 2 (get all)
 * @returns 
 */
const getMasterDataFarms = async (activeStatus = 1) => {
    const request = _sqlserver.request()
    let sqlQuery = `select Farm_Id farmId, Farm_Name farmName from [dbo].[Farm] where Is_Deleted = 0`

    if (activeStatus === 1 || activeStatus === 0) {
        request.input('active', sql.SmallInt, activeStatus)
        sqlQuery += ' and Is_Active = @active; '
    }

    const result = await request.query(sqlQuery)
    return result.recordset
}

const getFarmById = async (farmId) => {
    const request = _sqlserver.request()
    request.input('farmId', sql.Int, farmId)

    let sqlQuery = 
        `select
            Farm_Id farmId, Farm_Name farmName, Address address, Farm_Area farmArea, 
            Total_House_Area totalHouseArea, Farm_Scale farmScale, Production_Scale productionScale, 
            Total_Employees totalEmployees, convert(varchar, Start_Time, 105) startTime
        from Farm where Farm_Id = @farmId and Is_Deleted = 0 and Is_Active = 1`
    const result = await request.query(sqlQuery)
    return result.recordset[0]
}


module.exports = {
    getMasterDataFarms,
    getFarmById
}