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
    return publicHttp({
      method: 'GET',
      url: `/farm/${farmId}/projects`,
    });
  }
}

export default FARM;
