import React, { useState } from 'react'
import { Button, Upload, message, Space, Image, Tooltip, Modal } from 'antd'
import { EditFilled, PlusOutlined } from '@ant-design/icons'
import token from '../../../utils/token'
const { getAccessToken, getRefreshToken } = token

const ImagesProfile = ({ isEditingImages, setIsEditingImages, imageList, setImageList, handleSave, profile }) => {
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState(
    imageList?.map((image, index) => ({ uid: String(-index), name: `image-${index}.png`, url: image }))
  )

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
        marginBottom: '1rem'
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Tải lên
      </div>
    </button>
  )

  const handleCancelPreview = () => setPreviewOpen(false)

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleCancel = () => {
    // Code để hủy chỉnh sửa ảnh
    setIsEditingImages(false)
    setImageList(profile?.images)
  }

  const handleImageChange = (info) => {
    // Code để xử lý khi có thay đổi trong danh sách ảnh
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
      // Cập nhật danh sách ảnh mới
      setImageList(info.fileList.map((file) => file.response.metadata.thumb_url))
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
    const newFileList = info.fileList
    setFileList([...newFileList])
  }

  const handleRemoveImage = (index) => {
    // Code để xóa ảnh khỏi danh sách
    const newList = [...imageList]
    newList.splice(index, 1)
    setImageList(newList)
  }

  const uploadProps = {
    action: 'http://127.0.0.1:3052/v1/api/upload/single',
    method: 'post',
    accept: 'image/*',
    name: 'file',
    listType: 'picture-card',
    headers: {
      authorization: getAccessToken(),
      'x-rtoken-id': getRefreshToken()
    },
    onChange: (info) => handleImageChange(info),
    onPreview: handlePreview,
    onRemove: (file) => {
      handleRemoveImage(parseInt(file.uid))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <h2 style={{ marginRight: '1rem' }}>Hình ảnh</h2>
        <Tooltip title="Chỉnh sửa hình ảnh">
          <EditFilled style={{ color: '#476930' }} onClick={() => setIsEditingImages(true)} />
        </Tooltip>
      </div>
      {isEditingImages ? (
        <div>
          <Upload {...uploadProps} fileList={fileList}>
            {uploadButton}
          </Upload>
          <Space>
            <Button type="primary" onClick={handleSave}>
              Lưu
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </Space>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
            <img
              alt="example"
              style={{
                width: '100%'
              }}
              src={previewImage}
            />
          </Modal>
        </div>
      ) : (
        <div>
          {imageList && imageList.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {imageList?.map((image, index) => (
                <div key={index} style={{ margin: '8px', position: 'relative' }}>
                  <Image src={image} alt={`image-${index}`} />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p>Chưa có ảnh nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ImagesProfile
