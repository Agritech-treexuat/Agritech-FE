import publicHttp from './http/publicHttp.config'
import privateHttp from './http/privateHttp.config'

const QR = {
  getQRByProject: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/qr/project/${projectId}`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  exportQR: async ({ projectId, outputId, data }) => {
    return await privateHttp({
      method: 'POST',
      url: `/qr/export/${projectId}/${outputId}`,
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

export default QR
