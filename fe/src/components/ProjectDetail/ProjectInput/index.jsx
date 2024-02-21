import React, { useState } from 'react'
import { useParams } from 'react-router'
import Loading from '../../../pages/Loading'
import UpdateInputPopup from './UpdateInputPopup'
import { Col, Row, notification, Button, Modal, Tooltip, Divider, Form } from 'antd'
import { formatDate, formatDateTime } from '../../../utils/helpers'
import useProjectInput from './useProjectInput'
import SeedModal from '../AddProject/AddProjectSeed'
import PROJECT from '../../../services/projectService'
import EditInputHistory from './EditInputHistory'
import { EditFilled } from '@ant-design/icons'
import UpdateInputForm from './UpdateInputForm'

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

  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  const handleUpdateOverview = async (values) => {
    const data = {
      startDate: values.date,
      square: values.square,
      description: values.description
    }
    try {
      await PROJECT.editProjectInfo(data, projectId)
      refetch()
    } catch (error) {
      console.error(error?.response?.data?.message)
    }
    setIsModalOpen(false)
  }

  const renderStatus = (status) => {
    switch (status) {
      case 'inProgress':
        return 'Đang thực hiện'
      case 'finished':
        return 'Hoàn thành'
      case 'cancel':
        return 'Đã hủy'
      default:
        return 'Chưa cập nhật'
    }
  }

  return (
    <div>
      {contextHolder}
      {isSuccess ? (
        <div>
          <Row>
            <Col span={10}>
              <h2 style={{ margin: '0px' }}>
                Thông tin dự án (cập nhật lúc {formatDateTime(projectInfo.createdAtTime)})
              </h2>
              {projectInfo.isInfoEdited ? <EditInputHistory historyInfo={projectInfo.historyInfo} /> : null}
            </Col>
            <Col span={14} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Modal
                title="Chỉnh sửa đầu vào"
                open={isModalOpen}
                onOk={() => {
                  form
                    .validateFields()
                    .then((values) => {
                      form.resetFields()
                      handleUpdateOverview(values)
                    })
                    .catch((info) => {
                      console.log('Validate Failed:', info)
                    })
                }}
                onCancel={() => setIsModalOpen(false)}
                okText="Cập nhật"
                cancelText="Hủy"
              >
                <UpdateInputForm input={projectInfo} form={form} />
              </Modal>
              <SeedModal
                selectedPlant={{ id: projectInfo?.plant._id }}
                open={openUpdateSeed}
                onClose={() => setOpenUpdateSeed(false)}
                selectedSeed={selectedSeed}
                setSelectedSeed={setSelectedSeed}
                handleAddSeed={handleUpdateSeed}
                isAddSeed={false}
              />
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
          <div style={{ fontSize: '1.2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <Divider />
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>Cây: </label>
                <span>{projectInfo.plant.plant_name}</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>Transaction hash: </label>
                <span>{projectInfo.txHash}</span>
              </div>
              <Divider />
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>Trạng thái: </label>
                <span>{renderStatus(projectInfo.status)}</span>
                <Tooltip title="Chỉnh sửa trạng thái">
                  <EditFilled
                    style={{ marginLeft: '0.5rem' }}
                    onClick={() => {
                      setOpenUpdateStatus(true)
                    }}
                  />
                </Tooltip>
              </div>
              <Divider />
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>Hạt giống: </label>
                <span>{projectInfo.seed.seed_name}</span>
                <Tooltip title="Chỉnh sửa hạt giống">
                  <EditFilled
                    style={{ marginLeft: '0.5rem' }}
                    onClick={() => {
                      setOpenUpdateSeed(true)
                    }}
                  />
                </Tooltip>
              </div>
              <Divider />
              <div style={{ marginBottom: '1rem', display: 'flex' }}>
                <h3> Thông tin khác </h3>
                <Tooltip title="Chỉnh sửa thông tin khác">
                  <EditFilled style={{ marginLeft: '0.5rem' }} onClick={() => setIsModalOpen(true)} />
                </Tooltip>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>Diện tích trồng: </label>
                <span>{projectInfo.square || 'Chưa cập nhật'}</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>Ngày bắt đầu: </label>
                <span>{formatDate(projectInfo.startDate)}</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold' }}>Mô tả: </label>
                <span>{projectInfo.description || 'Chưa cập nhật'}</span>
              </div>
              <Divider />
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectInput
