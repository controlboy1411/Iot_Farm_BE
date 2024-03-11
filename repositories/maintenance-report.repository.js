const sql = require('mssql')
const constant = require('../utils/constant')

const insertReport = async function(farmId, houseId, roosterDie, henDie, roosterRemove, henRemove, roosterFeedMass, henFeedMass, 
    totalEgg, selectEgg, overSizeEgg, underSizeEgg, deformedEgg, dirtyEgg, beatenEgg, brokenEgg, creatorId) 
{
    const request = _sqlserver.request()
    request.input('farmId', sql.Int, farmId)
    request.input('houseId', sql.Int, houseId)
    request.input('roosterDie', sql.Int, roosterDie)
    request.input('henDie', sql.Int, henDie)
    request.input('roosterRemove', sql.Int, roosterRemove)
    request.input('henRemove', sql.Int, henRemove)
    request.input('roosterFeedMass', sql.Decimal, roosterFeedMass)
    request.input('henFeedMass', sql.Decimal, henFeedMass)
    request.input('totalEgg', sql.Int, totalEgg)
    request.input('selectEgg', sql.Int, selectEgg)
    request.input('overSizeEgg', sql.Int, overSizeEgg)
    request.input('underSizeEgg', sql.Int, underSizeEgg)
    request.input('deformedEgg', sql.Int, deformedEgg)
    request.input('dirtyEgg', sql.Int, dirtyEgg)
    request.input('beatenEgg', sql.Int, beatenEgg)
    request.input('brokenEgg', sql.Int, brokenEgg)
    request.input('creatorId', sql.Int, creatorId)

    let sqlCommand = 
        `insert into Maintenance_Report (
            Farm_Id, House_Id,
            Rooster_Die, Hen_Die,
            Rooster_Remove, Hen_Remove,
            Rooster_Feed_Mass, Hen_Feed_Mass,
            Total_Egg, Select_Egg,
            Over_Size_Egg, Under_Size_Egg,
            Deformed_Egg, Dirty_Egg,
            Beaten_Egg, Broken_Egg,
            Status, Is_Deleted, Created_Date, Creator_Id
        )
        values (
            @farmId, @houseId, @roosterDie, @henDie, @roosterRemove, @henRemove, @roosterFeedMass, @henFeedMass,
            @totalEgg, @selectEgg, @overSizeEgg, @underSizeEgg, @deformedEgg, @dirtyEgg, @beatenEgg, @brokenEgg,
            '${constant.REPORT_STATUS.PENDING}', 0, GETDATE(), @creatorId
        )`

    const result = await request.query(sqlCommand)
    return result
}

const reviewReport = async function(reportId, reportStatus, reviewerId) {
    const request = _sqlserver.request()
    request.input('reviewerId', sql.Int, reviewerId)
    request.input('reportStatus', sql.NVarChar, reportStatus)
    request.input('reportId', sql.Int, reportId)

    let sqlCommand =
        `update Maintenance_Report
        set Reviewer_Id = @reviewerId, [Status] = @reportStatus, Reviewed_Date = GETDATE()
        where Id = @reportId and Is_Deleted = 0`
    
    const result = await request.query(sqlCommand)
    return result
}

const getReportById = async function(reportId) {
    const request = _sqlserver.request()
    request.input('reportId', sql.Int, reportId)

    let sqlQuery = `select * from Maintenance_Report where Id = @reportId and Is_Deleted = 0`
    const result = await request.query(sqlQuery)
    return result
}

const searchLivestockReport = async function(offset, limit, farmId, houseId, reportDate, status = 'All') {
    const request = _sqlserver.request()
    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, limit)
    request.input('farmId', sql.Int, farmId)
    request.input('houseId', sql.Int, houseId)
    request.input('reportDate', sql.VarChar, reportDate)

    let condition = ` mr.Is_Deleted = 0 and mr.Farm_Id = @farmId and mr.House_Id = @houseId `

    if (status !== 'All') {
        request.input('status', sql.NVarChar, status)
        condition += ' and mr.[Status] = @status '
    }

    condition += ' and convert(varchar, mr.Created_Date, 105) = @reportDate '

    let sqlQuery = 
        `select
            mr.Id reportId, cr.Full_Name creator, convert(varchar, mr.Created_Date, 120) createdDate,
            rv.Full_Name reviewer, convert(varchar, mr.Reviewed_Date, 120) reviewedDate, mr.[Status] reportStatus,
            mr.Rooster_Die roosterDie, mr.Hen_Die henDie, mr.Rooster_Remove roosterRemove, mr.Hen_Remove henRemove,
            mr.Rooster_Feed_Mass roosterFeedMass, mr.Hen_Feed_Mass henFeedMass, mr.Total_Egg totalEgg, mr.Select_Egg selectEgg,
            mr.Over_Size_Egg overSizeEgg, mr.Under_Size_Egg underSizeEgg, mr.Deformed_Egg deformedEgg, mr.Dirty_Egg dirtyEgg,
            mr.Beaten_Egg beatenEgg, mr.Broken_Egg brokenEgg
        from Maintenance_Report mr
        left join [dbo].[User] cr on mr.Creator_Id = cr.[User_Id] and cr.Is_Deleted = 0
        left join [dbo].[User] rv on mr.Reviewer_Id = rv.[User_Id] and rv.Is_Deleted = 0
        where ${condition}
        order by mr.Created_Date desc
        offset @offset rows
        fetch next @limit rows only;`

    let countQuery = 
        `select
            count(mr.Id) total
        from Maintenance_Report mr
        left join [dbo].[User] cr on mr.Creator_Id = cr.[User_Id] and cr.Is_Deleted = 0
        left join [dbo].[User] rv on mr.Reviewer_Id = rv.[User_Id] and rv.Is_Deleted = 0
        where ${condition}`

    const result = await Promise.all([
        request.query(sqlQuery), request.query(countQuery)
    ])

    return {
        data: result[0].recordset || [],
        total: result[1]?.recordset[0]?.total || 0
    }
}

module.exports = {
    insertReport,
    reviewReport,
    getReportById,
    searchLivestockReport
}