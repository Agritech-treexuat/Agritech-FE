import privateHttp from './http/privateHttp.config'
import publicHttp from './http/publicHttp.config'

const HASH = {
  hashImages: async ({ data }) => {
    return await publicHttp({
      method: 'POST',
      url: `/hash`,
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

export default HASH
