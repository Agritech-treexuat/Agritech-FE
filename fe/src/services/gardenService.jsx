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

  getGardenOutput: async (gardenId) => {
    return await publicHttp({
      method: 'GET',
      url: `delivery/${gardenId}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getGardenTemplate: async (gardenId) => {
    return await publicHttp({
      method: 'GET',
      url: `gardenPlantFarming/${gardenId}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getGardenProject: async (gardenId) => {
    return await publicHttp({
      method: 'GET',
      url: `gardenProject/${gardenId}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getRequestGarden: async (gardenId) => {
    return await publicHttp({
      method: 'GET',
      url: `clientRequests/${gardenId}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  updateDeliveryStatus: async (data, gardenId, deliveryId) => {
    return await publicHttp({
      method: 'POST',
      url: `clientRequests/${gardenId}/${deliveryId}`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  addDelivery: async (data, gardenId) => {
    return await publicHttp({
      method: 'POST',
      url: `clientRequests/${gardenId}`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  }
}


export default GARDEN;
