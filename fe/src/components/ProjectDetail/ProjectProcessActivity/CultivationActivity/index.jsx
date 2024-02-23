import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Button, Table, Modal, Form, Input, DatePicker, Popconfirm, Tooltip } from 'antd'
import { ParagraphWithEllipsis, formatDateTime, formatTransactionHashTable } from '../../../../utils/helpers'
import { metamaskWallet } from '@thirdweb-dev/react'
import { DeleteFilled, EditFilled, EditOutlined, HistoryOutlined } from '@ant-design/icons'
const metamaskConfig = metamaskWallet()

const HistoryModal = ({ history, historyModalVisible, handleHistoryModalCancel, isGarden }) => {
  // write a modal history (do not use table), updateTime is modifiedAt and make it highlight. The other information is time, tx, cultivationActivity.name, cultivationActivity.description
  return (
    <Modal title="Lịch sử chỉnh sửa" open={historyModalVisible} onCancel={handleHistoryModalCancel} footer={null}>
      {history &&
        history.map((item, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <p>
              <span style={{ fontWeight: 'bold' }}>Created time: </span>
              {formatDateTime(item.createdAtTime)}
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>Updated time: </span>
              {formatDateTime(item.modifiedAt)}
            </p>
            <p>
              <span>Time: </span>
              {formatDateTime(item.time)}
            </p>
            {!isGarden && (
              <p>
                <span>
                  Tx: <a href={`https://escan.live/tx/${item.tx}`} target="_blank" rel="noreferrer">{`${item.tx}`}</a>
                </span>
              </p>
            )}
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
  form.setFieldsValue({
    time: selectedPlantFarming?.time ? dayjs(selectedPlantFarming?.time) : dayjs(new Date()),
    name: selectedPlantFarming?.name,
    description: selectedPlantFarming?.description
  })
  return (
    <Modal
      open={modal2Visible}
      title={isUpdate ? 'Cập nhật hành động' : 'Thêm hành động'}
      okText={isUpdate ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      onCancel={() => {
        form.resetFields()
        handleModal2Cancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.setFieldsValue(values)
            let data = {}
            if (isUpdate) {
              data = {
                processId: selectedPlantFarming.processId,
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
        <Form.Item name="time" label="Thời gian" rules={[{ required: true, message: 'Hãy chọn thời gian!' }]}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên"
          rules={[
            {
              required: true,
              message: 'Hãy nhập tên hoạt động!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            {
              required: true,
              message: 'Hãy nhập mô tả!'
            }
          ]}
        >
          <Input.TextArea placeholder="Mô tả" style={{ width: '100%' }} autoSize={{ minRows: 5 }} />
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
  connect,
  isGarden
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
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      width: '150px',
      render: (text, record) => formatDateTime(record.time)
    },
    ...(isGarden
      ? []
      : [
          {
            title: 'Transaction hash',
            dataIndex: 'tx',
            key: 'tx',
            width: '150px',
            render: (text, record) =>
              formatTransactionHashTable({
                str: record.tx,
                a: 8,
                b: 6
              })
          }
        ]),
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: '150px',
      render: (text, record) => record.cultivationActivity.name
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => <ParagraphWithEllipsis text={record.cultivationActivity.description} rows={3} />
    },
    {
      title: 'Hoạt động',
      dataIndex: 'actions',
      key: 'actions',
      width: '150px',
      render: (text, record) => (
        <>
          <Tooltip title={address || isGarden ? 'Chỉnh sửa' : 'Kết nối với ví để chỉnh sửa'}>
            {address || isGarden ? (
              <EditFilled
                style={{ marginRight: '2rem', cursor: 'pointer' }}
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
              />
            ) : (
              <EditOutlined
                style={{ marginRight: '2rem', cursor: 'pointer' }}
                onClick={async () => {
                  await connect(metamaskConfig)
                }}
              />
            )}
          </Tooltip>
          <Popconfirm
            title="Xóa"
            description="Bạn có chắc chắn muốn xóa không"
            onConfirm={handleDeleteProcess.bind(this, record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <DeleteFilled style={{ cursor: 'pointer', marginRight: '2rem' }} />
            </Tooltip>
          </Popconfirm>
          {record.isEdited ? (
            <Tooltip title="Xem lịch sử chỉnh sửa">
              <HistoryOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedPlantFarming(record)
                  setModalHistoryVisible(true)
                }}
              />
            </Tooltip>
          ) : null}
        </>
      )
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          style={{ marginRight: '8px' }}
          onClick={async () => {
            if (isGarden) {
              setModal1Visible(true)
            } else {
              if (!address) await connect(metamaskConfig)
              else {
                console.log('address: ', address)
                setModal1Visible(true)
              }
            }
          }}
        >
          {address || isGarden ? 'Thêm' : 'Kết nối với ví để thêm'}
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
        isGarden={isGarden}
      />
    </div>
  )
}

export default CultivationTable
