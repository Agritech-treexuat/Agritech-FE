import React, { useState } from 'react'
import { useParams } from 'react-router'
import Loading from '../../../pages/Loading'
import { Col, Row, notification, Button, Modal, Tooltip, Divider, Form, Typography, Spin, Checkbox } from 'antd'
import { formatDate, formatDateTime } from '../../../utils/helpers'
import useProjectInput from './useProjectInput'
import SeedModal from '../AddProject/AddProjectSeed'
import PROJECT from '../../../services/projectService'
import EditInputHistory from './EditInputHistory'
import { EditFilled, EditOutlined } from '@ant-design/icons'
import UpdateInputForm from './UpdateInputForm'
import { useStateContext } from '../../../context'
import { metamaskWallet } from '@thirdweb-dev/react'
const metamaskConfig = metamaskWallet()
const { Paragraph } = Typography

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

// Modal component for selecting cameras
const CameraSelectionModal = ({ visible, cameraList, selectedCameras, setSelectedCameras, onCancel, onSubmit }) => {
  return (
    <Modal
      open={visible}
      title="Lựa chọn camera"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          Cập nhật
        </Button>
      ]}
    >
      {/* Render list of cameras with checkboxes */}
      {cameraList.map((camera) => (
        <div key={camera.id}>
          <Checkbox
            checked={selectedCameras.includes(camera._id)}
            onChange={() => {
              const updatedSelection = selectedCameras.includes(camera._id)
                ? selectedCameras.filter((id) => id !== camera._id)
                : [...selectedCameras, camera._id]
              setSelectedCameras(updatedSelection)
            }}
          >
            {camera.name}
          </Checkbox>
        </div>
      ))}
    </Modal>
  )
}

const ProjectInput = () => {
  const { updateInput, connect, address } = useStateContext()
  const projectId = useParams().id
  const [loading, setLoading] = useState(false)
  const [loadingCamera, setLoadingCamera] = useState(false)
  const [openUpdateSeed, setOpenUpdateSeed] = useState(false)
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false)
  const [openUpdateCamera, setOpenUpdateCamera] = useState(false)

  const [selectedSeed, setSelectedSeed] = useState(null)
  const {
    projectInfo,
    isSuccess,
    refetch,
    cameraData,
    isSuccessCamera,
    cameraInProject,
    isSuccessCameraInProject,
    refetchCameraInProject
  } = useProjectInput({ projectId })
  const [selectedCameras, setSelectedCameras] = useState(cameraInProject?.map((camera) => camera._id) || null)

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
    setLoading(true)
    try {
      const receip = await updateInput({
        pId: projectInfo?.projectIndex,
        input: `Update seed: projectId: ${projectId}, seed: ${selectedSeed.name}, status: ${projectInfo.status}, square: ${projectInfo.square}, date: ${projectInfo.startDate}, description: ${projectInfo.description}`
      })
      const tx = receip?.transactionHash
      if (!tx) {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        setLoading(false)
        return
      }
      const data = {
        seed: selectedSeed.id,
        txHash: tx
      }
      setLoading(false)
      const res = await PROJECT.editProjectInfo(data, projectId)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
    setOpenUpdateSeed(false)
  }

  const handleUpdateStatus = async (status) => {
    setLoading(true)
    try {
      const receip = await updateInput({
        pId: projectInfo?.projectIndex,
        input: `Update status: projectId: ${projectId}, status: ${status}, seed: ${projectInfo.seed.seed_name}, square: ${projectInfo.square}, date: ${projectInfo.startDate}, description: ${projectInfo.description}`
      })
      const tx = receip?.transactionHash
      if (!tx) {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        setLoading(false)
        return
      }
      const data = {
        status: status,
        txHash: tx
      }
      setLoading(false)
      const res = await PROJECT.editProjectInfo(data, projectId)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
    setOpenUpdateStatus(false)
  }

  const handleUpdateOverview = async (values) => {
    setLoading(true)
    try {
      const receip = await updateInput({
        pId: projectInfo?.projectIndex,
        input: `Update overview: projectId: ${projectId}, square: ${values.square}, date: ${values.date}, description: ${values.description}, status: ${projectInfo.status}, seed: ${projectInfo.seed.seed_name}`
      })
      const tx = receip?.transactionHash
      if (!tx) {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        setLoading(false)
        return
      }
      const data = {
        startDate: values.date,
        square: values.square,
        description: values.description,
        txHash: tx
      }

      setLoading(false)
      const res = await PROJECT.editProjectInfo(data, projectId)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
  }

  const handleUpdateCamera = async () => {
    setLoadingCamera(true)
    try {
      const data = {
        cameraId: selectedCameras
      }
      const res = await PROJECT.updateCameraToProject({ data, projectId })
      setLoadingCamera(false)
      if (res.status === 200) {
        refetchCameraInProject()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
      }
    } catch (error) {
      setLoadingCamera(false)
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
    setOpenUpdateCamera(false)
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
    <Spin spinning={loading} tip="Đang ghi lên Blockchain, làm ơn chờ chút ...">
      <Spin spinning={loadingCamera}>
        <div>
          {contextHolder}
          {isSuccess && isSuccessCamera && isSuccessCameraInProject ? (
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
                          form.setFieldsValue(values)
                          handleUpdateOverview(values)
                          form.resetFields()
                          setIsModalOpen(false)
                        })
                        .catch((info) => {
                          console.log('Validate Failed:', info)
                        })
                    }}
                    onCancel={() => {
                      form.resetFields()
                      setIsModalOpen(false)
                    }}
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
                  <CameraSelectionModal
                    visible={openUpdateCamera} // Set visibility of CameraSelectionModal
                    cameraList={cameraData} // Pass camera data
                    selectedCameras={selectedCameras || cameraInProject?.map((camera) => camera._id)} // Pass selected cameras
                    setSelectedCameras={setSelectedCameras} // Pass function to update selected cameras
                    onCancel={() => {
                      setSelectedCameras(cameraInProject?.map((camera) => camera._id))
                      setOpenUpdateCamera(false)
                    }} // Set onCancel function
                    onSubmit={handleUpdateCamera} // Set onSubmit function
                  />
                </Col>
              </Row>
              <div style={{ fontSize: '1.2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <Divider />
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Danh sách Camera: </label>
                    <Tooltip title="Chỉnh sửa Danh sách Camera">
                      <EditFilled
                        style={{ marginLeft: '0.5rem' }}
                        onClick={() => {
                          setOpenUpdateCamera(true)
                        }}
                      />
                    </Tooltip>
                    <ul>
                      {cameraInProject.map((camera) => (
                        <li key={camera._id}>{camera.name}</li>
                      ))}
                    </ul>
                  </div>
                  <Divider />
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Cây: </label>
                    <span>{projectInfo?.plant?.plant_name}</span>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Transaction hash: </label>
                    <span>
                      <a href={`https://escan.live/tx/${projectInfo.txHash}`} target="_blank" rel="noreferrer">
                        {projectInfo?.txHash}
                      </a>
                    </span>
                  </div>
                  <Divider />
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Trạng thái: </label>
                    <span>{renderStatus(projectInfo?.status)}</span>
                    <Tooltip title={address ? 'Chỉnh sửa trạng thái' : 'Kết nối với ví để chỉnh sửa trạng thái'}>
                      {address ? (
                        <EditFilled
                          style={{ marginLeft: '0.5rem' }}
                          onClick={() => {
                            setOpenUpdateStatus(true)
                          }}
                        />
                      ) : (
                        <EditOutlined
                          style={{ marginLeft: '0.5rem' }}
                          onClick={async () => {
                            await connect(metamaskConfig)
                          }}
                        />
                      )}
                    </Tooltip>
                  </div>
                  <Divider />
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Hạt giống: </label>
                    <span>{projectInfo.seed.seed_name}</span>
                    <Tooltip title={address ? 'Chỉnh sửa hạt giống' : 'Kết nối với ví để chỉnh sửa hạt giống'}>
                      {address ? (
                        <EditFilled
                          style={{ marginLeft: '0.5rem' }}
                          onClick={() => {
                            setOpenUpdateSeed(true)
                          }}
                        />
                      ) : (
                        <EditOutlined
                          style={{ marginLeft: '0.5rem' }}
                          onClick={async () => {
                            await connect(metamaskConfig)
                          }}
                        />
                      )}
                    </Tooltip>
                  </div>
                  <Divider />
                  <div style={{ marginBottom: '1rem', display: 'flex' }}>
                    <h3> Thông tin khác </h3>
                    <Tooltip title={address ? 'Chỉnh sửa thông tin khác' : 'Kết nối với ví để chỉnh sửa khác'}>
                      {address ? (
                        <EditFilled
                          style={{ marginLeft: '0.5rem' }}
                          onClick={() => {
                            setIsModalOpen(true)
                          }}
                        />
                      ) : (
                        <EditOutlined
                          style={{ marginLeft: '0.5rem' }}
                          onClick={async () => {
                            await connect(metamaskConfig)
                          }}
                        />
                      )}
                    </Tooltip>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Diện tích trồng: </label>
                    <span>{projectInfo.square || 'Chưa cập nhật'} m2</span>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Ngày bắt đầu: </label>
                    <span>{formatDate(projectInfo.startDate)}</span>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Mô tả: </label>
                    <span>
                      {
                        <Paragraph
                          ellipsis={{
                            rows: 3,
                            expandable: true,
                            symbol: 'đọc thêm',
                            tooltip: true,
                            onExpand: function (event) {
                              console.log('onExpand', event)
                              event.stopPropagation()
                              event.preventDefault()
                            }
                          }}
                          style={{ fontSize: '1.2rem' }}
                        >
                          {projectInfo.description || 'Chưa cập nhật'}
                        </Paragraph>
                      }
                    </span>
                  </div>
                  <Divider />
                </div>
              </div>
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </Spin>
    </Spin>
  )
}

export default ProjectInput
