import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Button, Table, Modal, Form, Input, DatePicker, Select, Popconfirm } from 'antd'
import { formatDateTime } from '../../../../utils/helpers'
const { Option } = Select

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
              <span>fertilizationTime: </span>
              {item.fertilizationActivity.fertilizationTime}
            </p>
            <p>
              <span>Type: </span>
              {item.fertilizationActivity.type}
            </p>
            <p>
              <span>Description: </span>
              {item.fertilizationActivity.description}
            </p>
          </div>
        ))}
    </Modal>
  )
}

const Modal2 = ({ modal2Visible, handleModal2Ok, handleModal2Cancel, selectedPlantFarming, isUpdate }) => {
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
                type: 'fertilize',
                fertilizationActivity: {
                  fertilizationTime: values.fertilizationTime,
                  type: values.type,
                  description: values.description
                }
              }
            } else {
              data = {
                tx: 'tx',
                time: values.time.toDate(),
                type: 'fertilize',
                fertilizationActivity: {
                  fertilizationTime: values.fertilizationTime,
                  type: values.type,
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
          fertilizationTime: selectedPlantFarming?.fertilizationTime,
          type: selectedPlantFarming?.type,
          description: selectedPlantFarming?.description
        }}
      >
        {/* pick time */}
        <Form.Item name="time" label="Time" rules={[{ required: true, message: 'Please pick time!' }]}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          name="fertilizationTime"
          label="Fertilization Time"
          rules={[{ required: true, message: 'Please input fertilization time!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please input type!' }]}>
          <Select>
            <Option value="baseFertilizer">Bón lót</Option>
            <Option value="topFertilizer">Bón thúc</Option>
          </Select>
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

const FertilizeTable = ({
  fertilize,
  fertilizePlantFarming,
  handleAddProcess,
  handleUpdateProcess,
  handleDeleteProcess
}) => {
  const [modal1Visible, setModal1Visible] = useState(false)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false)
  const [modalHistoryVisible, setModalHistoryVisible] = useState(false)
  const [selectedPlantFarming, setSelectedPlantFarming] = useState(null)

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
      title: 'Fertilization Time',
      dataIndex: 'fertilizationTime',
      key: 'fertilizationTime',
      render: (text, record) => record.fertilizationActivity.fertilizationTime
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
      key: 'description',
      render: (text, record) => record.fertilizationActivity.description
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
              setSelectedPlantFarming({
                processId: record._id,
                time: record.time,
                fertilizationTime: record.fertilizationActivity.fertilizationTime,
                type: record.fertilizationActivity.type,
                description: record.fertilizationActivity.description
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
      <Table dataSource={fertilize} columns={columns} pagination={false} />

      {/* Modal 1 */}
      <Modal title="Chọn loại canh tác" open={modal1Visible} onOk={handleModal1Ok} onCancel={handleModal1Cancel}>
        {fertilizePlantFarming.map((plantFarming) => (
          <Button
            key={plantFarming.fertilizationTime}
            style={{
              marginBottom: '8px',
              display: 'block',
              backgroundColor: selectedPlantFarming === plantFarming ? '#1890ff' : '',
              color: selectedPlantFarming === plantFarming ? '#fff' : ''
            }}
            onClick={() => handlePlantFarmingSelect(plantFarming)}
          >
            {plantFarming.fertilizationTime}
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

export default FertilizeTable
