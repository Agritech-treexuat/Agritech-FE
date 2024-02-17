import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Button, Table, Modal, Form, Input, DatePicker, Popconfirm } from 'antd'
import { formatDateTime } from '../../../../utils/helpers'
import { metamaskWallet } from '@thirdweb-dev/react'
const metamaskConfig = metamaskWallet()

const HistoryModal = ({ history, historyModalVisible, handleHistoryModalCancel }) => {
  // write a modal history (do not use table), updateTime is modifiedAt and make it highlight. The other information is time, tx, cultivationActivity.name, cultivationActivity.description
  return (
    <Modal title="Lịch sử chỉnh sửa" open={historyModalVisible} onCancel={handleHistoryModalCancel} footer={null}>
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
              {item.cultivationActivity.name}
            </p>
            <p>
              <span>Description: </span>
              {item.cultivationActivity.description}
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
                type: 'cultivation',
                cultivationActivity: {
                  name: values.name,
                  description: values.description
                }
              }
            } else {
              data = {
                time: values.time.toDate(),
                type: 'cultivation',
                cultivationActivity: {
                  name: values.name,
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
          name: selectedPlantFarming?.name,
          description: selectedPlantFarming?.description
        }}
      >
        {/* pick time */}
        <Form.Item name="time" label="Time" rules={[{ required: true, message: 'Please pick time!' }]}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          name="name"
          label="name"
          rules={[
            {
              required: true,
              message: 'Please input name!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: 'Please input description!'
            }
          ]}
        >
          <Input.TextArea placeholder="Mô tả" style={{ width: '100%' }} autoSize={{ minRows: 3 }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const CultivationTable = ({
  cultivation,
  cultivationPlantFarming,
  handleAddProcess,
  handleUpdateProcess,
  handleDeleteProcess,
  address,
  connect
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
          <Button
            type="default"
            style={{ marginRight: '8px' }}
            onClick={() => {
              console.log(record)
              setSelectedPlantFarming({
                processId: record._id,
                time: record.time,
                name: record.cultivationActivity.name,
                description: record.cultivationActivity.description
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
        <Button
          type="primary"
          style={{ marginRight: '8px' }}
          onClick={async () => {
            if (!address) await connect(metamaskConfig)
            else {
              console.log('address: ', address)
              setModal1Visible(true)
            }
          }}
        >
          {address ? 'Thêm' : 'Connect'}
        </Button>
      </div>
      <Table dataSource={cultivation} columns={columns} pagination={false} />

      {/* Modal 1 */}
      <Modal title="Chọn loại canh tác" open={modal1Visible} onOk={handleModal1Ok} onCancel={handleModal1Cancel}>
        {cultivationPlantFarming.map((plantFarming) => (
          <Button
            key={plantFarming.name}
            style={{
              marginBottom: '8px',
              display: 'block',
              backgroundColor: selectedPlantFarming === plantFarming ? '#1890ff' : '',
              color: selectedPlantFarming === plantFarming ? '#fff' : ''
            }}
            onClick={() => handlePlantFarmingSelect(plantFarming)}
          >
            {plantFarming.name}
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

export default CultivationTable
