import React, { useState } from 'react'
import useProjectCertificate from './useProjectCertificate'
import Loading from '../../../pages/Loading'
import { notification } from 'antd'
import { useParams } from 'react-router-dom'
import ImagesProfile from '../../Profile/Image'
import PROJECT from '../../../services/projectService'

const ProjectCertificate = () => {
  const projectId = useParams().id
  const { certificateImages, isSuccess, refetch } = useProjectCertificate(projectId)

  const [isEditingImages, setIsEditingImages] = useState(false)
  const [imageList, setImageList] = useState(certificateImages)

  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const handleSave = async () => {
    try {
      if (isEditingImages) {
        const res = await PROJECT.updateCertificateImages({
          projectId: projectId,
          data: {
            images: imageList
          }
        })

        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        }
        setIsEditingImages(false)
      }
    } catch (error) {
      console.log('error: ', error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
  }

  return (
    <>
      {contextHolder}
      {isSuccess ? (
        <div>
          <ImagesProfile
            isEditingImages={isEditingImages}
            setIsEditingImages={setIsEditingImages}
            imageList={imageList || certificateImages}
            setImageList={setImageList}
            handleSave={handleSave}
            ProjectCertificate={ProjectCertificate}
            text="Chứng nhận"
            width={300}
          />
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default ProjectCertificate
