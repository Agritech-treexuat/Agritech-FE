import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import useProjectList from './useProjectList'
import { Input, Button, Flex, Row, Col, List, Radio, Space, notification, Typography, Spin } from 'antd'
import PlantModal from '../../components/ProjectDetail/AddProject/AddProjectPlant'
import SeedModal from '../../components/ProjectDetail/AddProject/AddProjectSeed'
import LargeDescriptionModal from '../../components/ProjectDetail/AddProject/AddLargeDescription'
import PROJECT from '../../services/projectService'
import { formatDateToInput } from '../../utils/helpers'
import { useStateContext } from '../../context'
import { metamaskWallet } from '@thirdweb-dev/react'
const metamaskConfig = metamaskWallet()
const { Paragraph } = Typography

const ProjectList = () => {
  const { createProject, connect, address } = useStateContext()
  const farmId = localStorage.getItem('id')
  const [loading, setLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [description, setDescription] = useState('')
  const [square, setSquare] = useState(null)
  const [expectedEndDate, setExpectedEndDate] = useState(null)
  const [expectedOutput, setExpectedOutput] = useState(null)
  const [value, setValue] = useState('all')

  const { projects, isSuccess, refetch } = useProjectList({
    plantId: selectedPlant?.id
  })

  const [open, setOpen] = useState(false)
  const [openSeed, setOpenSeed] = useState(false)
  const [openDescription, setOpenDescription] = useState(false)

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
    setLoading(true)
    try {
      const receip = await createProject({
        farm: farmId,
        input: `Add project: plant: ${selectedPlant.name}, seed: ${
          selectedSeed.name
        }, startDate: ${new Date()}, description: ${description}, square: ${square}, expectedEndDate: ${expectedEndDate}, expectedOutput: ${expectedOutput}`
      })
      const txHash = receip?.transactionHash
      if (!txHash) {
        openNotificationWithIcon('error', 'Thông báo', 'Khởi tạo thất bại ')
        setLoading(false)
        reset()
        return
      }
      const projectIndex = receip.events[0].args[0].toNumber()
      const data = {
        plantId: selectedPlant.id,
        seedId: selectedSeed.id,
        startDate: new Date(),
        description: description,
        square: square,
        expectedEndDate: expectedEndDate,
        expectedOutput: expectedOutput,
        txHash: txHash,
        projectIndex: projectIndex
      }
      setLoading(false)
      const res = await PROJECT.initProject(data)
      console.log('res: ', res)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Khởi tạo thành công')
        reset()
      }
      reset()
    } catch (error) {
      setLoading(false)
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Khởi tạo thất bại ')
      reset()
    }
    setOpenSeed(false)
  }

  const reset = () => {
    setSelectedPlant(null)
    setSelectedSeed(null)
    setDescription('')
    setSquare(null)
    setExpectedEndDate(null)
    setExpectedOutput(null)
  }

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const renderStatus = (status) => {
    switch (status) {
      case 'inProgress':
        return 'Đang thực hiện'
      case 'finished':
        return 'Đã kết thúc'
      case 'cancel':
        return 'Đã hủy'
      default:
        return 'Chưa có thông tin'
    }
  }

  return (
    <div>
      {contextHolder}
      {isSuccess ? (
        <Spin spinning={loading} tip="Đang ghi lên Blockchain, làm ơn chờ chút ...">
          <div>
            <h1>Danh sách các dự án</h1>
            <Row>
              <Col span={4}></Col>
              <Col span={1}></Col>
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
                <LargeDescriptionModal
                  visible={openDescription}
                  onCancel={() => {
                    setOpenDescription(false)
                  }}
                  onSubmit={handleSubmit}
                  description={description}
                  setDescription={setDescription}
                  square={square}
                  setSquare={setSquare}
                  expectedEndDate={expectedEndDate}
                  setExpectedEndDate={setExpectedEndDate}
                  expectedOutput={expectedOutput}
                  setExpectedOutput={setExpectedOutput}
                />
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
                          extra={<img width={200} alt={item.title} src={item.image} />}
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
                          <p style={{ marginBottom: '0.5rem' }}>
                            <strong>Diện tích trồng (m2): </strong> {item.square || 'Chưa có thông tin'}
                          </p>
                          <p style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontStyle: 'italic', color: '#666' }}>
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
                              >
                                {item.description}
                              </Paragraph>
                            </span>
                          </p>
                          <p style={{ marginBottom: 0, fontWeight: 'bold', color: '#1890ff' }}>
                            {renderStatus(item.status)}
                          </p>
                        </List.Item>
                      </Link>
                    </div>
                  )}
                />
              </Col>
            </Row>
          </div>
        </Spin>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectList
