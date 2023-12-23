import React, { useState } from 'react'
import { Button, Modal, Upload, Image, Divider } from 'antd'
import { formatDate, formatDateTime } from '../../../utils/helpers'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

const EditInputHistory = ({ input }) => {
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
      <Modal
        title="Lịch sử chỉnh sửa"
        style={{ width: 'fit-content' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {input.historyInput.map((input) => (
          <div style={{ width: 'fit-content' }}>
            <Divider>Chỉnh sửa lúc: {formatDateTime(input.modified_at)}</Divider>
            <div>
              <label>Transaction hash: </label>
              <span>{input.tx}</span>
            </div>
            <div>
              <label>Ngày bắt đầu: </label>
              <span>{formatDate(input.initDate)}</span>
            </div>
            <div>
              <label>Hạt giống: </label>
              <span>{input.seed}</span>
            </div>
            <div>
              <label>Lượng: </label>
              <span>{input.amount}</span>
            </div>
            <div>
              <label>Ảnh: </label>
              {input.images.length > 0 ? (
                input.images.map((image) => (
                  <span>
                    <Image class={'process-img'} src={image} />
                  </span>
                ))
              ) : (
                <span>Không có ảnh</span>
              )}
            </div>
          </div>
        ))}
      </Modal>
    </>
  )
}
export default EditInputHistory
