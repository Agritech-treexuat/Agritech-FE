import privateHttp from './http/privateHttp.config'
import publicHttp from './http/publicHttp.config'

const PLANT = {
    getAllPlant: async () => {
        return await publicHttp({
          method: 'GET',
          url: `/plant/recommend`
        })
          .then((res) => {
            return res
          })
          .catch((err) => {
            return err
          })
      },
    
      getPlantByPlantId: async (plantId) => {
        return await publicHttp({
          method: 'GET',
          url: `/plant/${plantId}`
        })
          .then((res) => {
            return res
          })
          .catch((err) => {
            return err
          })
      },
    
      getPlantFromFarm: async (farmId) => {
        return await publicHttp({
          method: 'GET',
          url: `/plant/farm/${farmId}`
        })
          .then((res) => {
            return res
          })
          .catch((err) => {
            return err
          })
      },
    
      addPlant: async (data) => {
        return await privateHttp({
          method: 'POST',
          url: `/farm/plant`,
          data
        })
          .then((res) => {
            return res
          })
          .catch((err) => {
            return err
          })
      },
    
      getPlantWithSeed: async () => {
        return await publicHttp({
          method: 'GET',
          url: `/plants-and-seeds`
        })
          .then((res) => {
            return res
          })
          .catch((err) => {
            return err
          })
      },
    
      getPlans: async (farmId, plantId) => {
        return await publicHttp({
          method: 'GET',
          url: `/farm/planInFarmFromPlant/${farmId}/${plantId}`
        })
          .then((res) => {
            return res
          })
          .catch((err) => {
            return err
          })
      },
    
      getAllSeedByPlantId: async (plantId) => {
        return await publicHttp({
          method: 'GET',
          url: `/seeds/${plantId}`
        })
          .then((res) => {
            return res
          })
          .catch((err) => {
            return err
          })
      },
    
      getAllSeedByPlantName: async (plantName) => {
        return await publicHttp({
          method: 'GET',
          url: `/seedsByPlantName/${plantName}`
        })
          .then((res) => {
            return res
          })
          .catch((err) => {
            return err
          })
      },
    
      getPlanFromSeed: async (farmId, seed) => {
        return await publicHttp({
          method: 'GET',
          url: `/plantCultivates/${farmId}/${seed}`
        })
          .then((res) => {
            return res
          })
          .catch((err) => {
            return err
          })
      },
}

export default PLANT