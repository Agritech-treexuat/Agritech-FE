import privateHttp from "./http/privateHttp.config";
import publicHttp from "./http/publicHttp.config";

const FARM = {
  me: () => privateHttp({
    method: 'GET',
    url: '/farm/me'
  }),
  login: async ({email, password}) => {
    let result = await publicHttp({
        method: 'POST',
        url: 'api/auth/signin',
        data: {
            email,
            password
        }
    });

    console.log("result: ", result)
    return result;
  },

  getProjects: async (farmId) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/${farmId}/projects`,
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
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  addExpect: async (data, projectId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/addExpect/${projectId}`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  addProcess: async (data, projectId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/addProcess/${projectId}`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  addOutput: async (data, projectId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/addOutput/${projectId}`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getInit: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/project/${projectId}/input`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getProcess: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/project/${projectId}/process`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getExpect: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/project/${projectId}/expect`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getOutput: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/project/${projectId}/output`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getImage: async (projectId, selectedDate) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/project/${projectId}/image/?date=${selectedDate}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  editProcess: async (data, projectId, processId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/editProcess/${projectId}/${processId}`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  editExpect: async (data, projectId, expectId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/editExpect/${projectId}/${expectId}`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  editOutput: async (data, projectId, outputId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/editOutput/${projectId}/${outputId}`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  editInput: async (data, projectId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/editInput/${projectId}`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  exportQR: async (projectId, outputId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/exportQR/${projectId}/${outputId}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getAllPlant: async () => {
    return await publicHttp({
      method: 'GET',
      url: `/plants`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getPlant: async (farmId) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/plant/${farmId}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  addPlant: async (data) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/plant`,
      data
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },

  getPlans: async (farmId, plantId) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/planInFarmFromPlant/${farmId}/${plantId}`,
    }).then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  },
}

export default FARM;
