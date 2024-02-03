import publicHttp from './http/publicHttp.config'
import privateHttp from './http/privateHttp.config'

const PROJECT = {
  getProjects: async (farmId) => {
    return await publicHttp({
      method: 'GET',
      url: `/project/farm/${farmId}`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  getProjectByProjectId: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/project/${projectId}`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  editProjectInfo: async (data, projectId) => {
    return await privateHttp({
      method: 'PATCH',
      url: `/project/${projectId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  initProject: async (data) => {
    return await privateHttp({
      method: 'POST',
      url: `project`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  createProjectGarden: async (data, gardenId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/createProjectGarden/${gardenId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  addExpect: async (data, projectId) => {
    return await privateHttp({
      method: 'POST',
      url: `/project/${projectId}/expect`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  addProcess: async (data, projectId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/addProcess/${projectId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  addOutput: async (data, projectId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/addOutput/${projectId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  getInit: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/project/${projectId}/input`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  getProcess: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/project/${projectId}/process`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  getExpect: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/project/${projectId}/expect`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  getOutput: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/project/${projectId}/output`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  getImage: async (projectId, selectedDate) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/project/${projectId}/image/?date=${selectedDate}`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  editProcess: async (data, projectId, processId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/editProcess/${projectId}/${processId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  editExpect: async (data, projectId, expectId) => {
    return await privateHttp({
      method: 'PATCH',
      url: `/project/${projectId}/expect/${expectId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  editOutput: async (data, projectId, outputId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/editOutput/${projectId}/${outputId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  editInput: async (data, projectId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/editInput/${projectId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  exportQR: async (projectId, outputId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/project/exportQR/${projectId}/${outputId}`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },
  getPlanFromProject: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/farm/plan/${projectId}`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  addPlantCultivatesToProject: async (data, projectId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/addPlantCultivate/${projectId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  updatePlantCultivatesToProject: async (data, projectId) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/addPlantCultivate/${projectId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  }
}

export default PROJECT
