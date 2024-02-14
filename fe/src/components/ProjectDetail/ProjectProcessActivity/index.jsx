import React from 'react'
import { Row, Col, Card, notification } from 'antd'
import useProjectProcess from './useProjectProcess'
import Loading from '../../../pages/Loading'
import CultivationTable from './CultivationActivity'
import PlantingTable from './PlantingActivity'
import FertilizeTable from './FertilizationActivity'
import OtherTable from './OtherActivity'
import PesticideTable from './PesticideActivity'

import PROJECT from '../../../services/projectService'

const ProcessActivityPage = ({ projectId }) => {
  const {
    cultivation,
    planting,
    fertilize,
    pesticide,
    other,
    isSuccess,
    refetch,
    cultivationPlantFarming,
    plantingPlantFarming,
    fertilizePlantFarming,
    pesticidePlantFarming,
    isSuccessPlantFarming
  } = useProjectProcess({
    projectId
  })

  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const handleAddProcess = async (values) => {
    console.log('Received values of form: ', values)
    const res = await PROJECT.addProcess({ data: values, projectId })
    if (res.status === 200) {
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công')
    } else {
      openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
    }
  }

  const handleUpdateProcess = async (values) => {
    console.log('Received values of form: ', values)
    const { processId, ...updateProcess } = values
    const res = await PROJECT.updateProcess({ data: updateProcess, projectId, processId })
    if (res.status === 200) {
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
    } else {
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
    }
  }

  const handleDeleteProcess = async (processId) => {
    console.log('Delete process: ', processId)
    const res = await PROJECT.deleteProcess({ projectId, processId })
    if (res.status === 200) {
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công')
    } else {
      openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
    }
  }

  return isSuccess && isSuccessPlantFarming ? (
    <>
      {contextHolder}
      <div style={{ padding: '24px' }}>
        <Row gutter={[16, 16]}>
          {/* Cultivation Activity */}
          <Col span={24}>
            <Card title="Hoạt động với đất">
              {/* List of cultivation activities */}
              <CultivationTable
                cultivation={cultivation}
                cultivationPlantFarming={cultivationPlantFarming}
                handleAddProcess={handleAddProcess}
                handleUpdateProcess={handleUpdateProcess}
                handleDeleteProcess={handleDeleteProcess}
              />
            </Card>
          </Col>

          {/* Planting Activity */}
          <Col span={24}>
            <Card title="Hoạt động gieo trồng">
              {/* Display planting activity */}
              <PlantingTable
                planting={planting}
                plantingPlantFarming={plantingPlantFarming}
                handleAddProcess={handleAddProcess}
                handleUpdateProcess={handleUpdateProcess}
                handleDeleteProcess={handleDeleteProcess}
              />
            </Card>
          </Col>

          {/* Fertilization Activity */}
          <Col span={24}>
            <Card title="Hoạt động bón phân">
              {/* Display fertilization activity */}
              <FertilizeTable
                fertilize={fertilize}
                fertilizePlantFarming={fertilizePlantFarming}
                handleAddProcess={handleAddProcess}
                handleUpdateProcess={handleUpdateProcess}
                handleDeleteProcess={handleDeleteProcess}
              />
            </Card>
          </Col>

          {/* Pest and Disease Control Activity */}
          <Col span={24}>
            <Card title="Hoạt động phòng ngừa sâu bệnh">
              {/* Display pest and disease control activity */}
              <PesticideTable
                pesticide={pesticide}
                pesticidePlantFarming={pesticidePlantFarming}
                handleAddProcess={handleAddProcess}
                handleUpdateProcess={handleUpdateProcess}
                handleDeleteProcess={handleDeleteProcess}
              />
            </Card>
          </Col>

          {/* Other Activity */}
          <Col span={24}>
            <Card title="Hoạt động khác">
              {/* Display other activity */}
              <OtherTable
                other={other}
                handleAddProcess={handleAddProcess}
                handleUpdateProcess={handleUpdateProcess}
                handleDeleteProcess={handleDeleteProcess}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  ) : (
    <Loading />
  )
}

export default ProcessActivityPage
