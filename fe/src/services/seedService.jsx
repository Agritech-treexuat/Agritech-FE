import publicHttp from './http/publicHttp.config'
import privateHttp from './http/privateHttp.config'

const SEED = {
  getAllSeedByPlantId: async (plantId) => {
    return await publicHttp({
      method: 'GET',
      url: `/seed/plant?plantId=${plantId}`
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
  }
}

export default SEED
