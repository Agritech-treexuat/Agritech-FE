import React from 'react'
import { Row, Col, Button, Card } from 'antd'
import useProjectProcess from './useProjectProcess'
import Loading from '../../../pages/Loading'
import { formatDateTime } from '../../../utils/helpers'

import { Table } from 'antd'

// cultivation: [{ time: Date, tx: String, name: String, description: String }]
const CultivationTable = ({ cultivation }) => {
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
      render: (text, record) => record.cultivationActivity.name
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => record.cultivationActivity.description
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
      <Table dataSource={cultivation} columns={columns} pagination={false} />
    </div>
  )
}

// planting: [{  time: Date, tx: String, density: String, description: String }]
const PlantingTable = ({ planting }) => {
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
      title: 'Density',
      dataIndex: 'density',
      key: 'density'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
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
      <Table dataSource={planting} columns={columns} pagination={false} />
    </div>
  )
}

// fertilize: [{  time: Date, tx: String, fertilizationTime: String, type: { type: String, enum: ['baseFertilizer', 'topFertilizer'] }, description: String }]
const FertilizeTable = ({ fertilize }) => {
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
      title: 'Fertilization Time',
      dataIndex: 'fertilizationTime',
      key: 'fertilizationTime'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => record.fertilizationActivity.type
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
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
      <Table dataSource={fertilize} columns={columns} pagination={false} />
    </div>
  )
}

const ProcessPage = ({ projectId }) => {
  const { cultivation, planting, fertilize, pesticide, other, isSuccess, isLoading, refetch } = useProjectProcess({
    projectId
  })
  return isSuccess ? (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        {/* Cultivation Activity */}
        <Col span={24}>
          <Card title="Hoạt động với đất">
            {/* List of cultivation activities */}
            <CultivationTable cultivation={cultivation} />
          </Card>
        </Col>

        {/* Planting Activity */}
        <Col span={24}>
          <Card title="Hoạt động gieo trồng">
            {/* Display planting activity */}
            <div>{/* Display planting activity */}</div>
            {/* Buttons: Add, Edit, History */}
            <div style={{ marginTop: '16px' }}>
              <Button type="primary" style={{ marginRight: '8px' }}>
                Thêm
              </Button>
              <Button type="default" style={{ marginRight: '8px' }}>
                Chỉnh sửa
              </Button>
              <Button type="default">Lịch sử chỉnh sửa</Button>
            </div>
          </Card>
        </Col>

        {/* Fertilization Activity */}
        <Col span={24}>
          <Card title="Hoạt động bón phân">
            {/* Display fertilization activity */}
            <div>{/* Display fertilization activity */}</div>
            {/* Buttons: Add, Edit, History */}
            <div style={{ marginTop: '16px' }}>
              <Button type="primary" style={{ marginRight: '8px' }}>
                Thêm
              </Button>
              <Button type="default" style={{ marginRight: '8px' }}>
                Chỉnh sửa
              </Button>
              <Button type="default">Lịch sử chỉnh sửa</Button>
            </div>
          </Card>
        </Col>

        {/* Pest and Disease Control Activity */}
        <Col span={24}>
          <Card title="Hoạt động phòng ngừa sâu bệnh">
            {/* Display pest and disease control activity */}
            <div>{/* Display pest and disease control activity */}</div>
            {/* Buttons: Add, Edit, History */}
            <div style={{ marginTop: '16px' }}>
              <Button type="primary" style={{ marginRight: '8px' }}>
                Thêm
              </Button>
              <Button type="default" style={{ marginRight: '8px' }}>
                Chỉnh sửa
              </Button>
              <Button type="default">Lịch sử chỉnh sửa</Button>
            </div>
          </Card>
        </Col>

        {/* Other Activity */}
        <Col span={24}>
          <Card title="Hoạt động khác">
            {/* Display other activity */}
            <div>{/* Display other activity */}</div>
            {/* Buttons: Add, Edit, History */}
            <div style={{ marginTop: '16px' }}>
              <Button type="primary" style={{ marginRight: '8px' }}>
                Thêm
              </Button>
              <Button type="default" style={{ marginRight: '8px' }}>
                Chỉnh sửa
              </Button>
              <Button type="default">Lịch sử chỉnh sửa</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  ) : (
    <Loading />
  )
}

export default ProcessPage
