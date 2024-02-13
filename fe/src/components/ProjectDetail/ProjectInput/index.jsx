import React, { useState } from 'react'
import { useParams } from 'react-router'
import Loading from '../../../pages/Loading'
import UpdateInputPopup from './UpdateInputPopup'
import { Col, Row, notification, Button, Modal } from 'antd'
import { formatDate } from '../../../utils/helpers'
import useProjectInput from './useProjectInput'
import SeedModal from '../AddProject/AddProjectSeed'
import PROJECT from '../../../services/projectService'

const UpdateStatusModal = ({ visible, onCancel, onInProgressUpdate, onCancelUpdate, onDoneUpdate, selectedItem }) => {
  return (
    selectedItem && (
      <Modal
        open={visible}
        title="Upate status"
        onCancel={onCancel}
        footer={null}
        width={400} // Đặt độ rộng cho Modal
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>Vui lòng chọn một lựa chọn để tiếp tục:</p>
          {selectedItem.status !== 'inProgress' && (
            <Button onClick={onInProgressUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Đang thực hiện
            </Button>
          )}
          {selectedItem.status !== 'finished' && (
            <Button onClick={onDoneUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Hoàn thành
            </Button>
          )}
          {selectedItem.status !== 'cancel' && (
            <Button onClick={onCancelUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Đã hủy
            </Button>
          )}
        </div>
      </Modal>
    )
  )
}

const ProjectInput = () => {
  const projectId = useParams().id
  const [openUpdateSeed, setOpenUpdateSeed] = useState(false)
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false)

  const [selectedSeed, setSelectedSeed] = useState(null)
  const { projectInfo, isSuccess, refetch } = useProjectInput({ projectId })

  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const handleUpdateSeed = async () => {
    try {
      const data = {
        seed: selectedSeed.id
      }
      const res = await PROJECT.editProjectInfo(data, projectId)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      }
    } catch (error) {
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
    setOpenUpdateSeed(false)
  }

  const handleUpdateStatus = async (status) => {
    try {
      const data = {
        status: status
      }
      const res = await PROJECT.editProjectInfo(data, projectId)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      }
    } catch (error) {
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
    setOpenUpdateStatus(false)
  }

  return (
    <div>
      {contextHolder}
      {isSuccess ? (
        <div>
          <Row>
            <Col span={4}>
              <h2 style={{ margin: '0px' }}>Thông tin khởi tạo</h2>
            </Col>
            <Col span={2}></Col>
            <Col span={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <UpdateInputPopup input={projectInfo} refetch={refetch} />
              <Button
                style={{ marginRight: '1rem' }}
                onClick={() => {
                  setOpenUpdateSeed(true)
                }}
              >
                Update Seed
              </Button>

              <SeedModal
                selectedPlant={{ id: projectInfo?.plant._id }}
                open={openUpdateSeed}
                onClose={() => setOpenUpdateSeed(false)}
                selectedSeed={selectedSeed}
                setSelectedSeed={setSelectedSeed}
                handleAddSeed={handleUpdateSeed}
                isAddSeed={false}
              />
              <Button
                onClick={() => {
                  setOpenUpdateStatus(true)
                }}
                style={{ marginRight: '1rem' }}
              >
                Update Status
              </Button>
              <UpdateStatusModal
                visible={openUpdateStatus}
                onCancel={() => {
                  setOpenUpdateStatus(false)
                }}
                onInProgressUpdate={() => {
                  handleUpdateStatus('inProgress')
                  setOpenUpdateStatus(false)
                }}
                onCancelUpdate={() => {
                  handleUpdateStatus('cancel')
                  setOpenUpdateStatus(false)
                }}
                onDoneUpdate={() => {
                  handleUpdateStatus('finished')
                  setOpenUpdateStatus(false)
                }}
                selectedItem={projectInfo}
              />
            </Col>
          </Row>
          <div>
            <label>Trạng thái: </label>
            <span>{projectInfo.status}</span>
          </div>
          <div>
            <label>Ngày bắt đầu: </label>
            <span>{formatDate(projectInfo.startDate)}</span>
          </div>
          <div>
            <label>Cây: </label>
            <span>{projectInfo.plant.plant_name}</span>
          </div>
          <div>
            <label>Hạt giống: </label>
            <span>{projectInfo.seed.seed_name}</span>
          </div>
          <div>
            <label>Diện tích trồng: </label>
            <span>{projectInfo.square || 'Chưa cập nhật'}</span>
          </div>
          <div>
            <label>Mô tả: </label>
            <span>{projectInfo.description || 'Chưa cập nhật'}</span>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectInput
