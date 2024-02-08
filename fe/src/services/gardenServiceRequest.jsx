import publicHttp from './http/publicHttp.config'
import privateHttp from './http/privateHttp.config'

const GARDEN_SERVICE_REQUEST = {
  getGardenServiceRequest: async (farmId, status) => {
    return await publicHttp({
      method: 'GET',
      url: `/gardenServiceRequest/farm/${farmId}/${status}`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  updateGardenServiceRequestStatus: async ({ status, serviceRequestId }) => {
    return await privateHttp({
      method: 'PATCH',
      url: `gardenServiceRequest/${serviceRequestId}/${status}`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  }
}

export default GARDEN_SERVICE_REQUEST