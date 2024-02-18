import React from 'react'
import { Button, Upload, message, Space, Image, Tooltip } from 'antd'
import { EditFilled, UploadOutlined } from '@ant-design/icons'
import token from '../../../utils/token'
const { getAccessToken, getRefreshToken } = token

const ImagesProfile = ({ isEditingImages, setIsEditingImages, imageList, setImageList, handleSave, profile }) => {
  const handleCancel = () => {
    // Code để hủy chỉnh sửa ảnh
    setIsEditingImages(false)
    setImageList(profile?.images)
  }

  const handleImageChange = (info) => {
    console.log('info: ', info)
    // Code để xử lý khi có thay đổi trong danh sách ảnh
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
      // Cập nhật danh sách ảnh mới
      setImageList(info.fileList.map((file) => file.response.metadata.thumb_url))
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  }

  const uploadProps = {
    action: 'http://127.0.0.1:3052/v1/api/upload/single',
    method: 'post',
    accept: 'image/*',
    name: 'file',
    headers: {
      authorization: getAccessToken(),
      'x-rtoken-id': getRefreshToken()
    }
  }

  const handleRemoveImage = (index) => {
    // Code để xóa ảnh khỏi danh sách
    const newList = [...imageList]
    newList.splice(index, 1)
    setImageList(newList)
  }

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <h2 style={{ marginRight: '1rem' }}>Images</h2>
        <Tooltip title="Edit images">
          <EditFilled style={{ color: '#476930' }} onClick={() => setIsEditingImages(true)} />
        </Tooltip>
      </div>
      {isEditingImages ? (
        <div>
          <Upload
            {...uploadProps}
            listType="picture-card"
            fileList={imageList?.map((image, index) => ({
              uid: String(index),
              name: 'image',
              status: 'done',
              url: image
            }))}
            onChange={handleImageChange}
            onRemove={(file) => {
              handleRemoveImage(parseInt(file.uid))
            }}
          >
            {imageList?.length >= 10 ? null : uploadButton}
          </Upload>
          <Space>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
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
              <p>Not has yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ImagesProfile
