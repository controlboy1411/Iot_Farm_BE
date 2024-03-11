const houseRepo = require('../repositories/house.repository')
const farmRepo = require('../repositories/farm.repository')

const getAllFarms = async function() {
    const result = await farmRepo.getMasterDataFarms(1)
    return result
}

const getAllHousesByFarm = async function(farmId) {
    const result = await houseRepo.getMasterDataHouses(Number(farmId))
    return result
}

module.exports = {
    getAllFarms,
    getAllHousesByFarm
}