const sql = require('mssql')

const getSummaryDataOfEachColumn = async (columnName, houseId, fromDate, toDate) => {
    const request = _sqlserver.request()
    request.input('houseId', sql.Int, houseId)
    request.input('fromDate', sql.VarChar, fromDate)
    request.input('toDate', sql.VarChar, toDate)

    const querySql = 
        `select 
            tmp.*,
            (
                select substring(convert(varchar, min(Measurement_Time), 120), 1, 16)
                from [dbo].[House_Transaction]
                where 
                    House_Id = @houseId and ${columnName} = tmp.max_value
                    and Measurement_Time >= CAST(@fromDate as datetime) and Measurement_Time < CAST(@toDate as datetime)
            ) as max_value_time,
            (
                select substring(convert(varchar, min(Measurement_Time), 120), 1, 16)
                from [dbo].[House_Transaction]
                where 
                    House_Id = @houseId and ${columnName} = tmp.min_value
                    and Measurement_Time >= CAST(@fromDate as datetime) and Measurement_Time < CAST(@toDate as datetime)
            ) as min_value_time
        from (
            select 
                isnull(min(${columnName}), 0) as min_value,
                isnull(max(${columnName}), 0) as max_value,
                isnull(avg(${columnName}), 0) as avg_value
            from [dbo].[House_Transaction]
            where 
                House_Id = @houseId 
                and Measurement_Time >= CAST(@fromDate as datetime) and Measurement_Time < CAST(@toDate as datetime)
        ) as tmp;`
    
    const result = await request.query(querySql)
    return result.recordset[0]
}

const getNumberOfOverRange = async (columnName, houseId, fromDate, toDate, maxValue, minValue) => {
    const request = _sqlserver.request()
    request.input('houseId', sql.Int, houseId)
    request.input('fromDate', sql.VarChar, fromDate)
    request.input('toDate', sql.VarChar, toDate)
    request.input('maxValue', sql.Float, maxValue)
    request.input('minValue', sql.Float, minValue)

    const querySql = 
        `select COUNT(Id) count
        from [dbo].[House_Transaction]
        where 
            House_Id = @houseId 
            and Measurement_Time >= CAST(@fromDate as datetime) and Measurement_Time < CAST(@toDate as datetime)
            and (${columnName} < @minValue or ${columnName} > @maxValue);`

    const result = await request.query(querySql)
    return result.recordset[0]
}

module.exports = {
    getSummaryDataOfEachColumn,
    getNumberOfOverRange
}