import React from 'react'
import './style.css'
import { Button } from 'antd'
import UpdateOutputPopup from '../UpdateOutputPopup'
import EditOutputHistory from '../EditOutputHistory'
import { Image } from 'antd'
import FARM from '../../../../services/farmService'
import { formatDate } from '../../../../utils/helpers'
import { useParams } from 'react-router'

const OutputItem = ({ output, setOutputData }) => {
  const { time, amount, amountPerOne, images, npp } = output
  const params = useParams()

  const handleQR = () => {
    handleExportQR(params.id, output._id)
  }

  const handleExportQR = async (projectId, outputId) => {
    try {
      const res = await FARM.exportQR(projectId, outputId)
      setOutputData(res.data.projectOutput)
      alert('Eport QR thanh cong')
    } catch (error) {
      console.error(error?.response?.data?.message)
    }
  }

  return (
    <div className="output-item">
      <p>Thời gian: {formatDate(time)}</p>
      <p>Lượng: {amount}</p>
      <p>Lượng trên 1 sản phẩm: {amountPerOne}</p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {images ? (
          images.map((image) => (
            <span>
              <Image class={'process-img'} src={image} />
            </span>
          ))
        ) : (
          <span>Không có ảnh</span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {npp ? (
          npp.map((npp_item) => (
            <div>
              <p>
                NPP: {npp_item.name} cùng lượng {npp_item.amount}
              </p>
            </div>
          ))
        ) : (
          <span>Không có npp</span>
        )}
      </div>
      <UpdateOutputPopup output={output} disabled={output.exportQR} setOutputData={setOutputData} />
      <> {output.isEdited ? <EditOutputHistory output={output} /> : <></>}</>
      <Button type="primary" onClick={handleQR} disabled={output.exportQR}>
        Xuất QR
      </Button>
    </div>
  )
}

export default OutputItem
