const constant = require('../utils/constant')
const { getListHouseId, formatObjectData, getCurrentDateVNTime } = require('../utils/helper')
const moment = require('moment')
const houseRepository = require('../repositories/house.repository')

const getTransferPageInfor = (currentHouseId) => {
    const listHouseId = getListHouseId()
    let previousHouseId = currentHouseId
    let nextHouseId = currentHouseId

    listHouseId.map((houseId, index) => {
        if (houseId == currentHouseId) {
            if (index > 0) {
                previousHouseId = listHouseId[index - 1]
            }

            if (index < listHouseId.length - 1) {
                nextHouseId = listHouseId[index + 1]
            }
        }
    })

    return {
        previous: previousHouseId,
        next: nextHouseId
    }
}

const getStatusBarData = async (currentHouseId) => {
    let sqlQuery = 
        `select top 1 
            round(Temperature, 2) as Temperature, round(Humidity, 2) as Humidity, 
            round(CO2 * 0.0001, 3) as CO2, NH3, 
            Wind_Status, Light_Status, Wind_Speed, round(Light_Intensity, 2) as Light_Intensity
        from House_Transaction
        where House_Id = ${currentHouseId}
        order by Measurement_Time desc`

    const result = await _sqlserver.query(sqlQuery)
    if (result.recordset.length > 0) {
        return formatObjectData(result.recordset[0])
    }
    return null
}

const getLineChartData = async (houseId, timeLines, distance) => {
    if (!Array.isArray(timeLines) || !distance) {
        return []
    }

    let result = { temp: [], humi: [], co2: [], nh3: [] }
    for (const time of timeLines) {
        const endTime = moment(time).format(constant.DATE_FORMAT.YYYY_MM_DD_HH_mm_ss)
        const startTime = moment(new Date(time).setMinutes(new Date(time).getMinutes() - distance)).format(constant.DATE_FORMAT.YYYY_MM_DD_HH_mm_ss)

        let sqlQuery = 
            `select
                ISNULL(AVG(CAST(Temperature as float)), 0) as avg_temp,
                ISNULL(AVG(CAST(Humidity as float)), 0) as avg_humi, 
                ISNULL(AVG(CAST(CO2 as float)) * 0.0001, 0) as avg_co2, 
                ISNULL(AVG(CAST(NH3 as float)), 0) as avg_nh3
            from House_Transaction where House_Id = ${houseId} and Measurement_Time > '${startTime}' and Measurement_Time <= '${endTime}'`
        
        const resultAVG = await _sqlserver.query(sqlQuery)
        result.temp.push(Number(resultAVG.recordset[0].avg_temp || 0).toFixed(2))
        result.humi.push(Number(resultAVG.recordset[0].avg_humi || 0).toFixed(2))
        result.co2.push(Number(resultAVG.recordset[0].avg_co2 || 0).toFixed(2))
        result.nh3.push(Number(resultAVG.recordset[0].avg_nh3 || 0).toFixed(2))
    }

    return result
}

const getLineChartDataV2 = async (houseId, selectedDate) => {
    let thisDateTime = new Date()
    let vnDateTimestamp = thisDateTime.setHours(thisDateTime.getUTCHours() + 7)
    let currentDate = moment(vnDateTimestamp).format(constant.DATE_FORMAT.YYYY_MM_DD)
    let date = currentDate
    if (selectedDate) {
        date = selectedDate
    }

    const timeLines = []
    if (new Date(date) < new Date(currentDate)) {
        for (let i = -1; i <= 23; i++) {
            const timeLine = moment(new Date(date).setHours(i)).format(constant.DATE_FORMAT.YYYY_MM_DD_HH_mm_ss)
            timeLines.push(timeLine)
        }
    } else {
        for (let i = -1; i <= moment(vnDateTimestamp).hours(); i++) {
            const timeLine = moment(new Date(date).setHours(i)).format(constant.DATE_FORMAT.YYYY_MM_DD_HH_mm_ss)
            timeLines.push(timeLine)
        }
    }

    let result = { temp: [], humi: [], co2: [], nh3: [] }
    for (let i = 0; i < timeLines.length - 1; i++) {
        const startTime = timeLines[i]
        const endTime = timeLines[i + 1]

        const sqlQuery = 
            `select
                ISNULL(AVG(CAST(Temperature as float)), 0) as avg_temp,
                ISNULL(AVG(CAST(Humidity as float)), 0) as avg_humi, 
                ISNULL(AVG(CAST(CO2 as float)) * 0.0001, 0) as avg_co2, 
                ISNULL(AVG(CAST(NH3 as float)), 0) as avg_nh3
            from House_Transaction where House_Id = ${houseId} and Measurement_Time > '${startTime}' and Measurement_Time <= '${endTime}'`
        
        const resultAVG = await _sqlserver.query(sqlQuery)
        result.temp.push({
            x: i,
            y: Number(Number(resultAVG.recordset[0].avg_temp || 0).toFixed(2))
        })
        result.humi.push({
            x: i,
            y: Number(Number(resultAVG.recordset[0].avg_humi || 0).toFixed(2))
        })
        result.co2.push({
            x: i,
            y: Number(Number(resultAVG.recordset[0].avg_co2 || 0).toFixed(2))
        })
        result.nh3.push({
            x: i,
            y: Number(Number(resultAVG.recordset[0].avg_nh3 || 0).toFixed(2))
        })
    }

    return result
}

const getDataTable = async (payload) => {
    const houseId = payload.houseId || ''
    const page = payload.page || 1
    const size = payload.size || 10
    let startDate = payload.startDate || ''
    let endDate = payload.endDate || ''

    const limit = size
    const offset = (page - 1) * size

    let whereFilter = `where House_Id = '${houseId}' `
    if (startDate) {
        startDate = moment(new Date(startDate)).format(constant.DATE_FORMAT.YYYY_MM_DD)
        whereFilter += `and Measurement_Time >= '${startDate}' `
    }
    if (endDate) {
        endDate = (new Date(endDate)).setDate(new Date(endDate).getDate() + 1)
        endDate = moment(endDate).format(constant.DATE_FORMAT.YYYY_MM_DD)
        whereFilter += `and Measurement_Time < '${endDate}' `
    }

    const sqlQuery =
        `select 
            ID, round(Humidity, 2) as Humidity, round(Temperature, 2) as Temperature, 
            Measurement_Time, NH3, round(CO2 * 0.0001, 3) as CO2, 
            Wind_Status, Light_Status, Wind_Speed, round(Light_Intensity, 2) as Light_Intensity
        from House_Transaction ${whereFilter}
        order by Measurement_Time desc
        offset ${offset} rows
        fetch next ${limit} rows only`

    const countSql =
        `select count(*) as count from House_Transaction ${whereFilter}`

    const resultQuery = await Promise.all([
        _sqlserver.query(sqlQuery),
        _sqlserver.query(countSql)
    ])

    const dataTable = resultQuery[0].recordset?.map(record => {
        return formatObjectData(record)
    })

    return {
        count: Math.ceil(resultQuery[1].recordset[0].count),
        totalPage: Math.ceil(resultQuery[1].recordset[0].count / size),
        data: dataTable
    }
}

const getHouseInformation = async (houseId) => {
    const result = await houseRepository.getHouseById(houseId)
    return result
}

module.exports = {
    getDataTable,
    getStatusBarData,
    getLineChartData,
    getTransferPageInfor,
    getHouseInformation,
    getLineChartDataV2
}