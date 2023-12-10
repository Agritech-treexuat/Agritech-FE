import privateHttp from "./http/privateHttp.config";
import publicHttp from "./http/publicHttp.config";

const SERVICE = {
  getServiceTemplate: async (farmId) => {
    return await publicHttp({
      method: 'GET',
      url: `/serviceTemplate/${farmId}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  initProject: async (data) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/initProject`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  addServiceTemplate: async (data) => {
    return await privateHttp({
      method: 'POST',
      url: `serviceTemplate/add`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  updateServiceTemplate: async (data, serviceTemplateId) => {
    return await privateHttp({
      method: 'PUT',
      url: `serviceTemplate/update/${serviceTemplateId}`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },
}

export default SERVICE;
