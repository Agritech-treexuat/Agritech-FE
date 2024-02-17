import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import useProjectList from './useProjectList'
import { Input, Button, Flex, Row, Col, List, Radio, Space, Modal, Form, notification } from 'antd'
import PlantModal from '../../components/ProjectDetail/AddProject/AddProjectPlant'
import SeedModal from '../../components/ProjectDetail/AddProject/AddProjectSeed'
import LargeDescriptionModal from '../../components/ProjectDetail/AddProject/AddLargeDescription'
import PROJECT from '../../services/projectService'
import { formatDateToInput } from '../../utils/helpers'
import UpdateInputForm from '../../components/ProjectDetail/ProjectInput/UpdateInputForm'

import { useStateContext } from '../../context'
import { metamaskWallet } from '@thirdweb-dev/react'
const metamaskConfig = metamaskWallet()

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

const ProjectList = () => {
  const { createProject, connect, address } = useStateContext()
  const [form] = Form.useForm()
  const farmId = localStorage.getItem('id')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState('')
  const [value, setValue] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)

  const { projects, isSuccess, refetch } = useProjectList({
    plantId: selectedPlant?.id
  })

  const [open, setOpen] = useState(false)
  const [openSeed, setOpenSeed] = useState(false)
  const [openDescription, setOpenDescription] = useState(false)
  const [openUpdateSeed, setOpenUpdateSeed] = useState(false)
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false)
  const [openUpdateOverview, setOpenUpdateOverview] = useState(false)

  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const filteredProjects =
    projects.length > 0
      ? projects
          .filter((project) => {
            return (
              project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              project.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
          })
          .filter((project) => {
            if (value === 'all') return project
            else return project.status.toLowerCase().includes(value.toLowerCase())
          })
      : []

  const handleAddPlant = (plant) => {
    setSelectedPlant(plant)
    setOpen(false)
    setOpenSeed(true)
  }

  const handleAddSeed = () => {
    setOpenSeed(false)
    setOpenDescription(true)
    // handleAddProject()
  }

  const handleSubmit = () => {
    handleAddProject()
    setOpenDescription(false)
  }

  const handleAddProject = async () => {
    // Thực hiện các thao tác khác khi thêm project
    try {
      const receip = await createProject({
        title: farmId,
        input: `${selectedPlant.id} - ${selectedSeed.id} - ${new Date()} - ${description}`
      })
      const txHash = receip.transactionHash
      console.log('txhash: ', txHash)
      const projectIndex = receip.events[0].args[0].toNumber()
      console.log('projectIndex: ', projectIndex)
      const data = {
        plantId: selectedPlant.id,
        seedId: selectedSeed.id,
        startDate: new Date(),
        description: description,
        txHash: txHash,
        projectIndex: projectIndex
      }
      const res = await PROJECT.initProject(data)
      console.log('res: ', res)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Khởi tạo thành công in db')
      }
      // openNotificationWithIcon('success', 'Thông báo', 'Khởi tạo thành công')
    } catch (error) {
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Khởi tạo thất bại ')
    }
    setOpenSeed(false)
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

  const onChange = (e) => {
    setValue(e.target.value)
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
      openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
    } catch (error) {
      console.error(error?.response?.data?.message)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
    setOpenUpdateOverview(false)
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
          <h1>Danh sách các dự án</h1>
          <Row>
            <Col span={4}></Col>
            <Col span={8}>
              <Input
                placeholder="Tìm kiếm các dự án"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
            <Col span={1}></Col>
            <Col span={6}>
              <Flex gap="small" wrap="wrap">
                <Button
                  type="primary"
                  onClick={async () => {
                    if (!address) await connect(metamaskConfig)
                    else {
                      console.log('address: ', address)
                      setOpen(true)
                    }
                  }}
                >
                  {address ? 'Tạo project mới' : 'Kết nối với ví để tạo project mới'}
                </Button>
              </Flex>
              <PlantModal
                open={open}
                onClose={() => {
                  setOpen(false)
                }}
                selectedPlant={selectedPlant}
                setSelectedPlant={setSelectedPlant}
                handleAddPlant={handleAddPlant}
              />
              <SeedModal
                selectedPlant={selectedPlant}
                open={openSeed}
                onClose={() => setOpenSeed(false)}
                selectedSeed={selectedSeed}
                setSelectedSeed={setSelectedSeed}
                handleAddSeed={handleAddSeed}
                isAddSeed={true}
              />
              <SeedModal
                selectedPlant={{ id: selectedItem?.plantId }}
                open={openUpdateSeed}
                onClose={() => setOpenUpdateSeed(false)}
                selectedSeed={selectedSeed}
                setSelectedSeed={setSelectedSeed}
                handleAddSeed={handleUpdateSeed}
                isAddSeed={false}
              />
              <LargeDescriptionModal
                visible={openDescription}
                onCancel={() => {
                  setOpenDescription(false)
                }}
                onSubmit={handleSubmit}
                description={description}
                setDescription={setDescription}
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
                selectedItem={selectedItem}
              />
              <Modal
                title="Chỉnh sửa đầu vào"
                open={openUpdateOverview}
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
                onCancel={() => setOpenUpdateOverview(false)}
                okText="Cập nhật"
                cancelText="Hủy"
              >
                <UpdateInputForm
                  input={{
                    startDate: selectedItem?.startDate,
                    square: selectedItem?.square,
                    description: selectedItem?.description
                  }}
                  form={form}
                />
              </Modal>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <div style={{ marginTop: '4rem', marginLeft: '2rem', padding: '2rem', backgroundColor: '#f1f4ed' }}>
                <h3>Lọc theo trạng thái</h3>
                <Radio.Group onChange={onChange} value={value}>
                  <Space direction="vertical">
                    <Radio value="all">Tất cả</Radio>
                    <Radio value="inProgress">Đang thực hiện</Radio>
                    <Radio value="finished">Đã kết thúc</Radio>
                    <Radio value="cancel">Đã hủy</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </Col>
            <Col span={20}>
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: (page) => {
                    console.log(page)
                  },
                  pageSize: 5
                }}
                dataSource={filteredProjects}
                style={{ marginTop: '3rem', width: '90%', marginLeft: '2rem' }}
                renderItem={(item, index) => (
                  <div>
                    <Link to={`/project/${item.id}`} key={item.id}>
                      <List.Item
                        key={item.id}
                        extra={<img width={272} alt={item.title} src={item.image} />}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ECFFDC' : '#C1E1C1',
                          marginBottom: '2rem',
                          borderRadius: '10px'
                        }}
                      >
                        <List.Item.Meta
                          title={item.title}
                          description={item.seed + ' - ' + formatDateToInput(item.startDate)}
                        />
                        <p>Diện tích trồng: {item.square || 'Chưa có thông tin'}</p>
                        <p>Mô tả: {item.description}</p>
                        <p>Trạng thái : {item.status}</p>
                      </List.Item>
                    </Link>
                    <div style={{ marginTop: '1rem' }}>
                      <Button
                        style={{ marginRight: '1rem' }}
                        onClick={() => {
                          setSelectedItem(item)
                          setProjectId(item.id)
                          setOpenUpdateSeed(true)
                        }}
                      >
                        Update Seed
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedItem(item)
                          setProjectId(item.id)
                          setOpenUpdateStatus(true)
                        }}
                        style={{ marginRight: '1rem' }}
                      >
                        Update Status
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedItem(item)
                          setProjectId(item.id)
                          setOpenUpdateOverview(true)
                        }}
                      >
                        Update Overview
                      </Button>
                    </div>
                  </div>
                )}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectList
