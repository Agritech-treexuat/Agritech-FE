import privateHttp from './http/privateHttp.config'
import publicHttp from './http/publicHttp.config'

const FARM = {
  me: () =>
    privateHttp({
      method: 'GET',
      url: '/farm/me'
    }),
  login: async ({ email, password }) => {
    let result = await publicHttp({
      method: 'POST',
      url: 'login',
      data: {
        email,
        password
      }
    })

    console.log('result: ', result)
    return result
  },

  addPlantCultivates: async (data) => {
    return await privateHttp({
      method: 'POST',
      url: `/farm/plantCultivates`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  updatePlantCultivates: async (data) => {
    return await privateHttp({
      method: 'PUT',
      url: `/farm/plantCultivates`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  getCultivative: async () => {
    return await publicHttp({
      method: 'GET',
      url: `/cultivative`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  }
}

export default FARM
