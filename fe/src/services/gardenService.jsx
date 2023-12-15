import privateHttp from "./http/privateHttp.config";
import publicHttp from "./http/publicHttp.config";

const GARDEN = {
  getGardens: async (farmId) => {
    return await publicHttp({
      method: 'GET',
      url: `garden/${farmId}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  updateStatusGarden: async (data, gardenId) => {
    return await privateHttp({
      method: 'PATCH',
      url: `updateGardenStatus/${gardenId}`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getGardenByGardenId: async (farmId, gardenId) => {
    return await publicHttp({
      method: 'GET',
      url: `garden/${farmId}/${gardenId}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getGardenInput: async (gardenId) => {
    return await publicHttp({
      method: 'GET',
      url: `projects/${gardenId}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },
}

export default GARDEN;
