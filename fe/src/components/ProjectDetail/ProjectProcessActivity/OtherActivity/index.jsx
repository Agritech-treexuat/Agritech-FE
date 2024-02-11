import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Button, Table, Modal, Form, Input, DatePicker } from 'antd'
import { formatDateTime } from '../../../../utils/helpers'

const HistoryModal = ({ history, historyModalVisible, handleHistoryModalCancel }) => {
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
              <span>Description: </span>
              {item.other.description}
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
                type: 'other',
                other: {
                  description: values.description
                }
              }
            } else {
              data = {
                tx: 'tx',
                time: values.time.toDate(),
                type: 'other',
                other: {
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
          description: selectedPlantFarming?.description
        }}
      >
        {/* pick time */}
        <Form.Item name="time" label="Time" rules={[{ required: true, message: 'Please pick time!' }]}>
          <DatePicker showTime />
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

const OtherTable = ({ other, handleAddProcess, handleUpdateProcess }) => {
  const [modal2Visible, setModal2Visible] = useState(false)
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false)
  const [modalHistoryVisible, setModalHistoryVisible] = useState(false)
  const [selectedPlantFarming, setSelectedPlantFarming] = useState(null)

  const handleModal2Cancel = () => {
    setModal2Visible(false)
  }

  const handleModalUpdateCancel = () => {
    setModalUpdateVisible(false)
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
          <Button
            type="default"
            style={{ marginRight: '8px' }}
            onClick={() => {
              console.log(record)
              setSelectedPlantFarming({
                processId: record._id,
                time: record.time,
                description: record.other.description
              })
              setModalUpdateVisible(true)
            }}
          >
            Chỉnh sửa
          </Button>
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
        <Button type="primary" style={{ marginRight: '8px' }} onClick={() => setModal2Visible(true)}>
          Thêm
        </Button>
      </div>
      <Table dataSource={other} columns={columns} pagination={false} />

      {/* Modal 2 */}
      <Modal2
        modal2Visible={modal2Visible}
        handleModal2Ok={handleAddProcess}
        handleModal2Cancel={handleModal2Cancel}
        selectedPlantFarming={null}
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

export default OtherTable
