import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Button, Table, Modal, Form, Input, DatePicker, Popconfirm, Tooltip, Spin, Divider } from 'antd'
import { ParagraphWithEllipsis, formatDateTime, formatTransactionHashTable } from '../../../../utils/helpers'
import { metamaskWallet } from '@thirdweb-dev/react'
import { DeleteFilled, EditFilled, EditOutlined, HistoryOutlined } from '@ant-design/icons'
const metamaskConfig = metamaskWallet()

const HistoryModal = ({ history, item, historyModalVisible, handleHistoryModalCancel, isGarden }) => {
  return (
    <Modal
      title="Lịch sử chỉnh sửa"
      open={historyModalVisible}
      onCancel={handleHistoryModalCancel}
      footer={null}
      width={600}
    >
      {history &&
        history.map((item, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <Divider>{formatDateTime(item.createdAtTime)}</Divider>
            {!isGarden && (
              <p>
                <span>
                  <strong>Transaction hash: </strong>{' '}
                  {formatTransactionHashTable({
                    str: item.tx,
                    a: 8,
                    b: 5
                  })}
                </span>
              </p>
            )}
            <p>
              <span>
                <strong>Thời gian: </strong>
              </span>
              {formatDateTime(item.time)}
            </p>

            <p>
              <span>
                <strong>Tên: </strong>
              </span>
              {item.plantingActivity.density}
            </p>
            <p>
              <span>
                <strong>Mô tả: </strong>
              </span>
              <ParagraphWithEllipsis text={item.plantingActivity.description} rows={3} />
            </p>
          </div>
        ))}
      {item && (
        <div style={{ marginBottom: '8px' }}>
          <Divider>{formatDateTime(item.createdAtTime)}</Divider>
          {!isGarden && (
            <p>
              <span>
                <strong>Transaction hash: </strong>{' '}
                {formatTransactionHashTable({
                  str: item.tx,
                  a: 8,
                  b: 5
                })}
              </span>
            </p>
          )}
          <p>
            <span>
              <strong>Thời gian: </strong>
            </span>
            {formatDateTime(item.time)}
          </p>

          <p>
            <span>
              <strong>Tên: </strong>
            </span>
            {item.plantingActivity?.density}
          </p>
          <p>
            <span>
              <strong>Mô tả: </strong>
            </span>
            <ParagraphWithEllipsis text={item.plantingActivity?.description} rows={3} />
          </p>
        </div>
      )}
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
  form.setFieldsValue({
    time: selectedPlantFarming?.time ? dayjs(selectedPlantFarming?.time) : dayjs(new Date()),
    density: selectedPlantFarming?.density,
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
                type: 'planting',
                plantingActivity: {
                  density: values.density,
                  description: values.description
                }
              }
            } else {
              data = {
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
        <Form.Item name="time" label="Thời gian" rules={[{ required: true, message: 'Hãy chọn thời gian!' }]}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item name="density" label="Mật độ" rules={[{ required: true, message: 'Hãy nhập mật độ!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Hãy nhập mô tả!' }]}>
          <Input.TextArea placeholder="Mô tả" style={{ width: '100%' }} autoSize={{ minRows: 5 }} />
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
  handleDeleteProcess,
  address,
  connect,
  isGarden,
  loading,
  loadingNonBlockchain
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
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      width: 150,
      render: (text, record) => formatDateTime(record.time),
      sorter: (a, b) => new Date(a.time) - new Date(b.time),
      showSorterTooltip: {
        title: 'Sắp xếp thời gian'
      }
    },
    ...(isGarden
      ? []
      : [
          {
            title: 'Transaction hash',
            dataIndex: 'tx',
            key: 'tx',
            width: 150,
            render: (text, record) =>
              formatTransactionHashTable({
                str: record.tx,
                a: 8,
                b: 6
              })
          }
        ]),
    {
      title: 'Mật độ',
      dataIndex: 'density',
      key: 'density',
      render: (text, record) => record.plantingActivity.density
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => record.plantingActivity.description
    },
    {
      title: 'Hoạt động',
      dataIndex: 'actions',
      key: 'actions',
      width: 150,
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
                    density: record.plantingActivity.density,
                    description: record.plantingActivity.description
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
      <Spin
        spinning={loading || loadingNonBlockchain}
        tip={`${(loadingNonBlockchain && 'Đang xử lý') || (loading && 'Đang ghi lên Blockchain, làm ơn chờ chút ...')}`}
        size="large"
      >
        <Table dataSource={planting} columns={columns} pagination={false} />
      </Spin>

      {/* Modal 1 */}
      <Modal
        title="Chọn tên hoạt động"
        open={modal1Visible}
        onOk={handleModal1Ok}
        onCancel={handleModal1Cancel}
        okText="Tiếp theo"
        cancelText="Hủy"
      >
        {plantingPlantFarming.map((plantFarming, index) => (
          <Button
            key={index}
            style={{
              marginBottom: '8px',
              backgroundColor: selectedPlantFarming === plantFarming ? '#1890ff' : '',
              color: selectedPlantFarming === plantFarming ? '#fff' : '',
              width: '100%',
              whiteSpace: 'normal',
              height: 'auto'
            }}
            onClick={() => handlePlantFarmingSelect(plantFarming)}
          >
            {plantFarming?.density}
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
        item={selectedPlantFarming}
        historyModalVisible={modalHistoryVisible}
        handleHistoryModalCancel={() => setModalHistoryVisible(false)}
        isGarden={isGarden}
      />
    </div>
  )
}

export default PlantingTable
