import React, { useState } from 'react'
import { Button, Modal, Upload, Image, Divider } from 'antd'
import { formatDate, formatDateTime } from '../../../../utils/helpers'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

const EditOutputHistory = ({ output }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleCancelImage = () => setPreviewOpen(false)
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Lịch sử chỉnh sửa
      </Button>
      <Modal title="Lịch sử chỉnh sửa" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        {output.historyOutput.map((output) => (
          <>
            <Divider>Chỉnh sửa lúc: {formatDateTime(output.modified_at)}</Divider>
            <div style={{ width: 'fit-content', marginRight: '10px' }}>
              <p>Tx: {output.tx}</p>
              <p>Thời gian: {output.time}</p>
              <p>Lượng: {output.amount}</p>
              <p>Lượng trên 1 sản phẩm: {output.amountPerOne}</p>

              <div>
                {output.npp ? (
                  output.npp.map((npp_item) => (
                    <div>
                      <p>
                        NPP: {npp_item.name} with amount: {npp_item.amount}
                      </p>
                    </div>
                  ))
                ) : (
                  <span>Không có npp</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {output.images ? (
                  output.images.map((image) => (
                    <span>
                      <Image class={'process-img'} src={image} />
                    </span>
                  ))
                ) : (
                  <span>Không có ảnh</span>
                )}
              </div>
            </div>
          </>
        ))}
      </Modal>
    </>
  )
}
export default EditOutputHistory
