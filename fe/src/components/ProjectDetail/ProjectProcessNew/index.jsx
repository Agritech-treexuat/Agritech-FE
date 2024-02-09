import React from 'react'
import { Row, Col, Button, Card, Collapse } from 'antd'
import useProjectProcess from './useProjectProcess'
import Loading from '../../../pages/Loading'
import { formatDateTime } from '../../../utils/helpers'
import CultivationTable from './CultivationActivity'
import PlantingTable from './PlantingActivity'
import FertilizeTable from './FertilizationActivity'

import { Table } from 'antd'
import PROJECT from '../../../services/projectService'

// fertilize: [{  time: Date, tx: String, fertilizationActivity: [{fertilizationTime: String, type: { type: String, enum: ['baseFertilizer', 'topFertilizer'] }, description: String }]}]
// const FertilizeTable = ({ fertilize }) => {
//   const columns = [
//     {
//       title: 'Time',
//       dataIndex: 'time',
//       key: 'time',
//       width: 150,
//       render: (text, record) => formatDateTime(record.time)
//     },
//     {
//       title: 'Tx',
//       dataIndex: 'tx',
//       key: 'tx',
//       width: 150
//     },
//     {
//       title: 'Fertilization Time',
//       dataIndex: 'fertilizationTime',
//       key: 'fertilizationTime',
//       render: (text, record) => record.fertilizationActivity.fertilizationTime
//     },
//     {
//       title: 'Type',
//       dataIndex: 'type',
//       key: 'type',
//       render: (text, record) => record.fertilizationActivity.type
//     },
//     {
//       title: 'Description',
//       dataIndex: 'description',
//       key: 'description',
//       render: (text, record) => record.fertilizationActivity.description
//     },
//     {
//       title: 'Actions',
//       dataIndex: 'actions',
//       key: 'actions',
//       render: (text, record) => (
//         <>
//           <Button type="default" style={{ marginRight: '8px' }}>
//             Chỉnh sửa
//           </Button>
//           <Button type="default">Lịch sử chỉnh sửa</Button>
//         </>
//       ),
//       width: 350
//     }
//   ]

//   return (
//     <div>
//       <div style={{ marginBottom: '16px' }}>
//         <Button type="primary" style={{ marginRight: '8px' }}>
//           Thêm
//         </Button>
//       </div>
//       <Table dataSource={fertilize} columns={columns} pagination={false} />
//     </div>
//   )
// }

// pesticide: [{  time: Date, tx: String, pestAndDiseaseControlActivity: [{name: String, type: { type: String, enum: ['pest', 'disease'] }, symptoms: String, description: String, solution: [String], note: String }]}]
const PesticideTable = ({ pesticide }) => {
  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 150,
      render: (text, record) => formatDateTime(record.time)
    },
    {
      title: 'Tx',
      dataIndex: 'tx',
      key: 'tx',
      width: 150
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => record.pestAndDiseaseControlActivity.name
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => record.pestAndDiseaseControlActivity.type
    },
    {
      title: 'Symptoms',
      dataIndex: 'symptoms',
      key: 'symptoms',
      render: (text, record) => record.pestAndDiseaseControlActivity.symptoms
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => record.pestAndDiseaseControlActivity.description
    },
    {
      title: 'Solution',
      dataIndex: 'solution',
      key: 'solution',
      render: (text, record) =>
        record.pestAndDiseaseControlActivity.solution.map((sol, index) => <div key={index}>{sol}</div>)
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (text, record) => record.pestAndDiseaseControlActivity.note
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="default" style={{ marginRight: '8px' }}>
            Chỉnh sửa
          </Button>
          <Button type="default">Lịch sử chỉnh sửa</Button>
        </>
      ),
      width: 350
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" style={{ marginRight: '8px' }}>
          Thêm
        </Button>
      </div>
      <Table dataSource={pesticide} columns={columns} pagination={false} />
    </div>
  )
}

// other: [{  time: Date, tx: String, other: [{description: String}]}]
const OtherTable = ({ other }) => {
  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 150,
      render: (text, record) => formatDateTime(record.time)
    },
    {
      title: 'Tx',
      dataIndex: 'tx',
      key: 'tx',
      width: 150
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => record.other.description
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="default" style={{ marginRight: '8px' }}>
            Chỉnh sửa
          </Button>
          <Button type="default">Lịch sử chỉnh sửa</Button>
        </>
      ),
      width: 350
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" style={{ marginRight: '8px' }}>
          Thêm
        </Button>
      </div>
      <Table dataSource={other} columns={columns} pagination={false} />
    </div>
  )
}

const ProcessPage = ({ projectId }) => {
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

  const handleAddProcess = async (values) => {
    console.log('Received values of form: ', values)
    await PROJECT.addProcess({ data: values, projectId })
    refetch()
  }

  const handleUpdateProcess = async (values) => {
    console.log('Received values of form: ', values)
    const { processId, ...updateProcess } = values
    await PROJECT.updateProcess({ data: updateProcess, projectId, processId })
    refetch()
  }
  return isSuccess && isSuccessPlantFarming ? (
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
            />
          </Card>
        </Col>

        {/* Pest and Disease Control Activity */}
        <Col span={24}>
          <Card title="Hoạt động phòng ngừa sâu bệnh">
            {/* Display pest and disease control activity */}
            <PesticideTable pesticide={pesticide} />
          </Card>
        </Col>

        {/* Other Activity */}
        <Col span={24}>
          <Card title="Hoạt động khác">
            {/* Display other activity */}
            <OtherTable other={other} />
          </Card>
        </Col>
      </Row>
    </div>
  ) : (
    <Loading />
  )
}

export default ProcessPage
