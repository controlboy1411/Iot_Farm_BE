const { formatObjectData } = require('../utils/helper')
const houseRepo = require('../repositories/house.repository')

const getListHouse = async (farmId) => {
    const querySql1 = 
        `select House_Id, House_Number, Is_Active from House where Farm_Id = ${farmId} and Is_Deleted = 0;`

    const resultQuery1 = await _sqlserver.query(querySql1)
    const listHouse = resultQuery1.recordset

    let response = []
    for (const house of listHouse) {
        let querySql =
            `select top 1
                round(Temperature, 2) as Temperature, round(Humidity, 2) as Humidity, 
                round(CO2 * 0.0001, 3) as CO2, NH3, 
                Wind_Status, Light_Status, Wind_Speed, round(Light_Intensity, 2) as Light_Intensity
            from House_Transaction where House_Id = ${house.House_Id} 
            order by Measurement_Time desc`

        const result = await _sqlserver.query(querySql)
        if (house.Is_Active && result.recordset.length > 0) {
            let formatedData = formatObjectData(result.recordset[0])
            response.push({ 
                houseId: house.House_Id, 
                houseNumber: house.House_Number,
                isActive: house.Is_Active, 
                humidity: formatedData.Humidity, 
                temperature: formatedData.Temperature,
                co2: formatedData.CO2,
                nh3: formatedData.NH3,
                windStatus: formatedData.Wind_Status,
                lightStatus: formatedData.Light_Status,
                windSpeed: formatedData.Wind_Speed,
                lightIntensity: formatedData.Light_Intensity
            })
        } else {
            response.push({ houseId: house.House_Id, houseNumber: house.House_Number, isActive: house.Is_Active })
        }
    }
    return response
}


const getActiveHouses = async (farmId) => {
    let sqlQuery = `select House_Id from House where Farm_Id = ${farmId || 0} and Is_Active = 1`
    const activeHouseObjs = await _sqlserver.query(sqlQuery)
    const result = activeHouseObjs.recordset?.map(obj => {
        return formatObjectData(obj)
    })

    return result
}

const activeHouse = async (data) => {
    const { farmId, houseId, roostersNum, hensNum, chickenBatch, weekNo } = data
    let sqlQuery = 
        `update House
        set 
            Total_Rooster = ${roostersNum}, Total_Hen = ${hensNum}, 
            Total_Rooster_Die = 0, Total_Hen_Die = 0,
            Batch_No = ${chickenBatch},
            Week_No = ${weekNo},
            Active_Date = SYSDATETIME(), Is_Active = 1
        where Farm_Id = ${farmId} and House_Id = ${houseId}`

    try {
        await _sqlserver.query(sqlQuery)
        return 1
    } catch (e) {
        console.log('Error while execute query update house: ', e?.message)
        return 0
    }
}

const searchHouses = async (page, size, farmId, status) => {
    const limit = Number(size)
    const offset = Number(page) * Number(size)
    const dataPaging = await houseRepo.searchHousesPaging(Number(farmId), Number(status), limit, offset)

    return dataPaging
}

module.exports = {
    getListHouse,
    getActiveHouses,
    activeHouse,
    searchHouses
}