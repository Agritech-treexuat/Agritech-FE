import React, { useState } from 'react'
import { Row, Col, Card, notification, Spin } from 'antd'
import useProjectProcess from './useProjectProcess'
import Loading from '../../../pages/Loading'
import CultivationTable from './CultivationActivity'
import PlantingTable from './PlantingActivity'
import FertilizeTable from './FertilizationActivity'
import OtherTable from './OtherActivity'
import PesticideTable from './PesticideActivity'

import PROJECT from '../../../services/projectService'
import { useStateContext } from '../../../context'

const ProcessActivityPage = ({ projectId }) => {
  const { insertProcess, connect, address } = useStateContext()
  const [loading, setLoading] = useState(false)
  const [loadingNonBlockchain, setLoadingNonBlockchain] = useState(false)
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
    isSuccessPlantFarming,
    projectInfo,
    isSuccessProjectInfo
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

  const renderProcessDataToWriteAdd = ({ values }) => {
    switch (values?.type) {
      case 'cultivation':
        return `Add process: projectId: ${projectId}, time: ${values?.time}, type: ${values?.type}, name: ${values?.cultivationActivity?.name}, description: ${values?.cultivationActivity?.description}`
      case 'planting':
        return `Add process: projectId: ${projectId}, time: ${values?.time}, type: ${values?.type}, density: ${values?.plantingActivity?.density}, description: ${values?.plantingActivity?.description}`
      case 'fertilize':
        return `Add process: projectId: ${projectId}, time: ${values?.time}, type: ${values?.type}, fertilizationTime: ${values?.fertilizationActivity?.fertilizationTime}, type: ${values?.fertilizationActivity?.type}, description: ${values?.fertilizationActivity?.description}`
      case 'pesticide':
        return `Add process: projectId: ${projectId}, time: ${values?.time}, type: ${values?.type}, name: ${
          values?.pestAndDiseaseControlActivity?.name
        }, type: ${values?.pestAndDiseaseControlActivity?.type}, symptoms: ${
          values?.pestAndDiseaseControlActivity?.symptoms
        }, solutions: ${values?.solution && values?.solution?.length > 0 ? values?.solution.join(', ') : 'not have'}`
      case 'other':
        return `Add process: projectId: ${projectId}, time: ${values?.time}, type: ${values?.type}, description: ${values?.other?.description}`
      default:
        return 'none'
    }
  }

  const renderProcessDataToWriteUpdate = ({ values, processId }) => {
    switch (values?.type) {
      case 'cultivation':
        return `Update process: projectId: ${projectId}, processId: ${processId}, time: ${values?.time}, type: ${values?.type}, name: ${values?.cultivationActivity?.name}, description: ${values?.cultivationActivity?.description}`
      case 'planting':
        return `Update process: projectId: ${projectId}, processId: ${processId}, time: ${values?.time}, type: ${values?.type}, density: ${values?.plantingActivity?.density}, description: ${values?.plantingActivity?.description}`
      case 'fertilize':
        return `Update process: projectId: ${projectId}, processId: ${processId}, time: ${values?.time}, type: ${values?.type}, fertilizationTime: ${values?.fertilizationActivity?.fertilizationTime}, type: ${values?.fertilizationActivity?.type}, description: ${values?.fertilizationActivity?.description}`
      case 'pesticide':
        return `Update process: projectId: ${projectId}, processId: ${processId}, time: ${values?.time}, type: ${
          values?.type
        }, name: ${values?.pestAndDiseaseControlActivity?.name}, type: ${
          values?.pestAndDiseaseControlActivity?.type
        }, symptoms: ${values?.pestAndDiseaseControlActivity?.symptoms}, solutions: ${
          values?.solution && values?.solution?.length > 0 ? values?.solution.join(', ') : 'not have'
        }`
      case 'other':
        return `Update process: projectId: ${projectId}, processId: ${processId}, time: ${values?.time}, type: ${values?.type}, description: ${values?.other?.description}`
      default:
        return 'none'
    }
  }

  const handleAddProcess = async (values) => {
    //     {
    //   "time": "2024-02-22T02:46:53.882Z",
    //   "type": "cultivation",
    //   "cultivationActivity": {
    //     "name": "Vệ sinh vườn",
    //     "description": "Vệ sinh vườn, dọn sạch các tàn dư thực vật của vụ trước, rải vôi cày xới kỹ sâu khoảng 20-25cm. "
    //   }
    // }
    console.log('Received values of form: ', values)
    let tx = 'none'
    console.log('projectInfo?.projectIndex:', projectInfo?.projectIndex)
    setLoading(true)

    try {
      if (!projectInfo?.isGarden) {
        // write to blockchain
        const receip = await insertProcess({
          pId: projectInfo?.projectIndex,
          process: renderProcessDataToWriteAdd({ values })
        })
        tx = receip?.transactionHash
        if (!tx) {
          openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
          setLoading(false)
          return
        }
      }
      setLoading(false)
      const res = await PROJECT.addProcess({
        data: {
          ...values,
          tx: tx
        },
        projectId
      })
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
      }
    } catch (error) {
      setLoading(false)
      console.log('error: ', error)
      openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
    }
  }

  const handleUpdateProcess = async (values) => {
    // {
    //   "processId": "65d6b5a0f0e5b78ef7694aa2",
    //   "time": "2024-02-22T02:46:53.882Z",
    //   "type": "cultivation",
    //   "cultivationActivity": {
    //     "name": "Vệ sinh vườn",
    //     "description": "Vệ sinh vườn, dọn sạch các tàn dư thực vật của vụ trước, rải vôi cày xới kỹ sâu khoảng 20-25cm. Update ở đây."
    //   }
    // }
    let tx = 'none'
    console.log('Received values of form: ', values)
    setLoading(true)
    try {
      if (!projectInfo?.isGarden) {
        // write to blockchain
        const receip = await insertProcess({
          pId: projectInfo?.projectIndex,
          process: renderProcessDataToWriteUpdate({ values, processId: values?.processId })
        })
        tx = receip?.transactionHash
        if (!tx) {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
          setLoading(false)
          return
        }
      }
      const { processId, ...updateProcess } = values
      const res = await PROJECT.updateProcess({
        data: {
          ...updateProcess,
          tx: tx
        },
        projectId,
        processId
      })
      setLoading(false)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
      }
    } catch (error) {
      setLoading(false)
      console.log('error: ', error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
    }
  }

  const handleDeleteProcess = async (processId) => {
    setLoadingNonBlockchain(true)
    try {
      const res = await PROJECT.deleteProcess({ projectId, processId })
      setLoadingNonBlockchain(false)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
      }
    } catch (error) {
      setLoadingNonBlockchain(false)
      openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
    }
  }

  return isSuccess && isSuccessPlantFarming && isSuccessProjectInfo ? (
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
                address={address}
                connect={connect}
                isGarden={projectInfo.isGarden}
                loading={loading}
                loadingNonBlockchain={loadingNonBlockchain}
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
                address={address}
                connect={connect}
                isGarden={projectInfo.isGarden}
                loading={loading}
                loadingNonBlockchain={loadingNonBlockchain}
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
                address={address}
                connect={connect}
                isGarden={projectInfo.isGarden}
                loading={loading}
                loadingNonBlockchain={loadingNonBlockchain}
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
                address={address}
                connect={connect}
                isGarden={projectInfo.isGarden}
                loading={loading}
                loadingNonBlockchain={loadingNonBlockchain}
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
                address={address}
                connect={connect}
                isGarden={projectInfo.isGarden}
                loading={loading}
                loadingNonBlockchain={loadingNonBlockchain}
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
