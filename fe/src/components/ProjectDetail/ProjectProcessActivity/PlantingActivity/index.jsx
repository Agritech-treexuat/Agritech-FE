import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Button, Table, Modal, Form, Input, DatePicker, Popconfirm } from 'antd'
import { formatDateTime } from '../../../../utils/helpers'

const HistoryModal = ({ history, historyModalVisible, handleHistoryModalCancel }) => {
  return (
    <Modal title="Lịch sử chỉnh sửa" visible={historyModalVisible} onCancel={handleHistoryModalCancel} footer={null}>
      {history &&
        history.map((item, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <p>
              <span style={{ fontWeight: 'bold' }}>Updated time: </span>
              {formatDateTime(item.modifiedAt)}
            </p>
            <p>
              <span>Time: </span>
              {formatDateTime(item.time)}
            </p>
            <p>
              <span>Tx: </span>
              {item.tx}
            </p>
            <p>
              <span>Name: </span>
              {item.plantingActivity.density}
            </p>
            <p>
              <span>Description: </span>
              {item.plantingActivity.description}
            </p>
          </div>
        ))}
    </Modal>
  )
}

const Modal2 = ({
  modal2Visible,
  handleModal2Ok,
  handleModal2Cancel,
  selectedPlantFarming,
  isUpdate,
  handleDeleteProcess
}) => {
  const [form] = Form.useForm()

  return (
    <Modal
      open={modal2Visible}
      title={isUpdate ? 'Update' : 'Create'}
      okText={isUpdate ? 'Update' : 'Create'}
      cancelText="Cancel"
      onCancel={() => {
        form.resetFields()
        handleModal2Cancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            let data = {}
            if (isUpdate) {
              data = {
                processId: selectedPlantFarming.processId,
                tx: 'tx',
                time: values.time.toDate(),
                type: 'planting',
                plantingActivity: {
                  density: values.density,
                  description: values.description
                }
              }
            } else {
              data = {
                tx: 'tx',
                time: values.time.toDate(),
                type: 'planting',
                plantingActivity: {
                  density: values.density,
                  description: values.description
                }
              }
            }
            handleModal2Ok(data)
            handleModal2Cancel()
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          time: selectedPlantFarming?.time ? dayjs(selectedPlantFarming?.time) : dayjs(new Date()),
          density: selectedPlantFarming?.density,
          description: selectedPlantFarming?.description
        }}
      >
        {/* pick time */}
        <Form.Item name="time" label="Time" rules={[{ required: true, message: 'Please pick time!' }]}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item name="density" label="Density" rules={[{ required: true, message: 'Please input density!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input description!' }]}
        >
          <Input.TextArea placeholder="Mô tả" style={{ width: '100%' }} autoSize={{ minRows: 3 }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const PlantingTable = ({
  planting,
  plantingPlantFarming,
  handleAddProcess,
  handleUpdateProcess,
  handleDeleteProcess
}) => {
  const [modal1Visible, setModal1Visible] = useState(false)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false)
  const [modalHistoryVisible, setModalHistoryVisible] = useState(false)
  const [selectedPlantFarming, setSelectedPlantFarming] = useState(null)
  console.log('planting', planting)
  console.log('plantingPlantFarming', plantingPlantFarming)

  const handleModal1Ok = () => {
    setModal1Visible(false)
    setModal2Visible(true)
  }

  const handleModal1Cancel = () => {
    setModal1Visible(false)
  }

  const handleModal2Cancel = () => {
    setModal2Visible(false)
  }

  const handleModalUpdateCancel = () => {
    setModalUpdateVisible(false)
  }

  const handlePlantFarmingSelect = (plantFarming) => {
    setSelectedPlantFarming(plantFarming)
    setModal1Visible(true)
  }

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
      key: 'density',
      render: (text, record) => record.plantingActivity.density
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => record.plantingActivity.description
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button
            type="default"
            style={{ marginRight: '8px' }}
            onClick={() => {
              console.log(record)
              setSelectedPlantFarming({
                processId: record._id,
                time: record.time,
                density: record.plantingActivity.density,
                description: record.plantingActivity.description
              })
              setModalUpdateVisible(true)
            }}
          >
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Xóa"
            description="Bạn có chắc chắn muốn xóa không"
            onConfirm={handleDeleteProcess.bind(this, record._id)}
          >
            <Button type="primary" style={{ marginRight: '8px' }}>
              Xóa
            </Button>
          </Popconfirm>
          {record.isEdited ? (
            <Button
              type="default"
              onClick={() => {
                setSelectedPlantFarming(record)
                setModalHistoryVisible(true)
              }}
            >
              Lịch sử chỉnh sửa
            </Button>
          ) : null}
        </>
      ),
      width: 350
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" style={{ marginRight: '8px' }} onClick={() => setModal1Visible(true)}>
          Thêm
        </Button>
      </div>
      <Table dataSource={planting} columns={columns} pagination={false} />

      {/* Modal 1 */}
      <Modal title="Chọn loại canh tác" open={modal1Visible} onOk={handleModal1Ok} onCancel={handleModal1Cancel}>
        {plantingPlantFarming.map((plantFarming, index) => (
          <Button
            key={index}
            style={{
              marginBottom: '8px',
              display: 'block',
              backgroundColor: selectedPlantFarming === plantFarming ? '#1890ff' : '',
              color: selectedPlantFarming === plantFarming ? '#fff' : ''
            }}
            onClick={() => handlePlantFarmingSelect(plantFarming)}
          >
            {plantFarming.density}
          </Button>
        ))}
        <Button
          key="none"
          style={{
            marginBottom: '8px',
            display: 'block',
            backgroundColor: selectedPlantFarming === null ? '#1890ff' : '',
            color: selectedPlantFarming === null ? '#fff' : ''
          }}
          onClick={() => handlePlantFarmingSelect(null)}
        >
          Khác
        </Button>
      </Modal>

      {/* Modal 2 */}
      <Modal2
        modal2Visible={modal2Visible}
        handleModal2Ok={handleAddProcess}
        handleModal2Cancel={handleModal2Cancel}
        selectedPlantFarming={selectedPlantFarming}
      />
      {/* Modal edit */}
      <Modal2
        modal2Visible={modalUpdateVisible}
        handleModal2Ok={handleUpdateProcess}
        handleModal2Cancel={handleModalUpdateCancel}
        selectedPlantFarming={selectedPlantFarming}
        isUpdate={true}
      />
      {/* Modal history */}
      <HistoryModal
        history={selectedPlantFarming?.historyProcess}
        historyModalVisible={modalHistoryVisible}
        handleHistoryModalCancel={() => setModalHistoryVisible(false)}
      />
    </div>
  )
}

export default PlantingTable
