import React, { useState } from 'react'
import './style.css'
import { Button, Modal, Upload } from 'antd'
import UpdateOutputPopup from '../UpdateOutputPopup'
import EditOutputHistory from '../EditOutputHistory'
import { Image } from 'antd'
import FARM from '../../../../services/farmService'
import { formatDate } from '../../../../utils/helpers'
import { useParams } from 'react-router'
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

const OutputItem = ({ output, setOutputData }) => {
  const { time, amount, amountPerOne, images, npp } = output
  console.log('images: ', images)
  const params = useParams()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState(images)
  const handleCancel = () => setPreviewOpen(false)
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    console.log('file list: ', fileList)
  }

  const handleQR = () => {
    // Xử lý logic xuất QR code ở đây
    handleExportQR(params.id, output._id)
  }

  const handleExportQR = async (projectId, outputId) => {
    try {
      console.log('data to send: ', projectId, outputId)
      const res = await FARM.exportQR(projectId, outputId)
      console.log('res export qr: ', res)
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
