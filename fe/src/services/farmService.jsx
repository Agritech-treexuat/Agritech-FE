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
  }
}

export default FARM;
