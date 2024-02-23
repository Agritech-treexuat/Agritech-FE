import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Loading from '../../../pages/Loading'
import {
  Space,
  Table,
  Button,
  Image,
  Modal,
  notification,
  Popconfirm,
  Form,
  DatePicker,
  InputNumber,
  Upload,
  Select,
  Tooltip
} from 'antd'
import { formatDate } from '../../../utils/helpers'
import EditOutputHistory from './EditOutputHistory'
import useProjectOutput from './useProjectOutput'
import PROJECT from '../../../services/projectService'
import dayjs from 'dayjs'
import token from '../../../utils/token'
import {
  EditFilled,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteFilled
} from '@ant-design/icons'
import { useStateContext } from '../../../context'
import { metamaskWallet } from '@thirdweb-dev/react'
const metamaskConfig = metamaskWallet()
const { getAccessToken, getRefreshToken } = token

const { Column } = Table
const normFile = (e) => {
  console.log('Upload event:', e)
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

const OutputModal = ({ modalVisible, handleModalOk, handleModalCancel, selectedOutput, isUpdate, alllDistributer }) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState(
    selectedOutput?.images.map((image, index) => ({
      uid: String(-index),
      name: `image-${index}.png`,
      status: 'done',
      thumb: image
    }))
  )
  useEffect(() => {
    // Di chuyển logic cập nhật trạng thái vào useEffect
    if (isUpdate && selectedOutput) {
      form.setFieldsValue({
        date: selectedOutput ? dayjs(selectedOutput?.time) : dayjs(new Date()),
        amount: selectedOutput.amount,
        'amount per one': selectedOutput.amountPerOne,
        npp: selectedOutput.distributerWithAmount.map((item) => ({
          id: item.distributer._id,
          name: item.distributer.name,
          amount: item.amount
        })),
        upload: selectedOutput.images.map((image, index) => ({
          uid: String(-index),
          name: `image-${index}.png`,
          status: 'done',
          url: image
        }))
      })
      setFileList(
        selectedOutput?.images.map((image, index) => ({
          uid: String(-index),
          name: `image-${index}.png`,
          status: 'done',
          thumb: image
        }))
      )
    } else {
      form.setFieldsValue({
        date: dayjs(new Date())
      })
    }
  }, [isUpdate, selectedOutput, form])

  const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
  const uploadProps = {
    action: 'http://127.0.0.1:3052/v1/api/upload/single',
    multiple: true,
    method: 'post',
    accept: 'image/*',
    name: 'file',
    headers: {
      authorization: getAccessToken(),
      'x-rtoken-id': getRefreshToken()
    },
    onChange: (info) => {
      console.log('info', info)
      if (info.file.status === 'done') {
        console.log(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        console.error(`${info.file.name} file upload failed.`)
      }
      setFileList(info.fileList)
    }
  }
  return (
    <Modal
      open={modalVisible}
      title={isUpdate ? 'Cập nhật đầu ra' : 'Thêm đầu ra'}
      okText={isUpdate ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      onCancel={() => {
        form.resetFields()
        handleModalCancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.setFieldsValue(values)
            handleModalOk(values)
            form.resetFields()
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
        initialValues={
          isUpdate && selectedOutput
            ? {
                date: selectedOutput ? dayjs(selectedOutput?.time) : dayjs(new Date()),
                amount: selectedOutput.amount,
                'amount per one': selectedOutput.amountPerOne,
                npp: selectedOutput.distributerWithAmount.map((item) => ({
                  id: item.distributer._id,
                  name: item.distributer.name,
                  amount: item.amount
                })),
                upload: selectedOutput.images.map((image, index) => ({
                  uid: String(-index),
                  name: `image-${index}.png`,
                  status: 'done',
                  url: image
                }))
              }
            : { date: dayjs(new Date()) }
        }
      >
        <Form.Item
          name="date"
          label="Thời gian"
          rules={[
            {
              required: true,
              message: 'Thời gian không được để trống'
            }
          ]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item name="upload" label="Ảnh" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload {...uploadProps} fileList={fileList} listType="picture">
            <Button icon={<UploadOutlined />}>Đăng ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="amount"
          label="Lượng"
          rules={[
            {
              required: true
            }
          ]}
        >
          <InputNumber addonAfter="kg" />
        </Form.Item>
        {/* amount per one */}
        <Form.Item
          name="amount per one"
          label="Lượng/sản phẩm"
          rules={[
            {
              required: true
            }
          ]}
        >
          <InputNumber addonAfter="kg" />
        </Form.Item>
        {/* list npp */}
        <Form.List name="npp">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: 'flex',
                    marginBottom: 8
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    value={[name, 'id']}
                    rules={[
                      {
                        required: true,
                        message: 'Thiếu tên'
                      }
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select a person"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      options={alllDistributer.map((distributer) => ({
                        value: distributer.id,
                        label: distributer.name
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'amount']}
                    rules={[
                      {
                        required: true,
                        message: 'Thiếu lượng'
                      }
                    ]}
                  >
                    <InputNumber addonAfter="kg" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm nhà phân phối
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  )
}

const ProjectOutput = () => {
  const params = useParams()
  const projectId = useParams().id
  const { outputData, isSuccess, refetch, alllDistributer, isSucessDistributer, projectInfo, isSuccessProjectInfo } =
    useProjectOutput({
      projectId: params.id
    })
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const { address, connect, insertOutput, updateOutput } = useStateContext()
  const [openAddOutput, setOpenAddOutput] = useState(false)
  const [openUpdateOutput, setOpenUpdateOutput] = useState(false)
  const [selectedOutput, setSelectedOutput] = useState(null)

  const handleModalAddCancel = () => {
    setOpenAddOutput(false)
  }

  const handleModalUpdateCancel = () => {
    setOpenUpdateOutput(false)
  }

  const handleModalAddOk = async (values) => {
    console.log('values', values)
    const images = values.upload ? values.upload.map((upload) => upload.response.metadata.thumb_url) : []
    const updatedValue = { ...values, time: values.date, amountPerOne: values['amount per one'], images: images }
    delete updatedValue.date
    delete updatedValue['amount per one']
    delete updatedValue.upload
    const dataWithoutTx = {
      ...updatedValue,
      exportQR: false,
      distributerWithAmount: updatedValue.npp.map((item) => ({
        distributer: item.name,
        amount: item.amount
      }))
    }
    const totalNppAmount = values.npp ? values.npp.reduce((total, item) => total + item.amount, 0) : 0

    if (values.amount >= totalNppAmount) {
      try {
        // const receip = await insertOutput({
        //   pId: projectInfo.projectIndex,
        //   output: 'inserted output test'
        // })
        // const txHash = receip?.transactionHash
        // console.log('txhash: ', txHash)
        // console.log('data send: ', {
        //   ...dataWithoutTx,
        //   tx: txHash
        // })
        // const data = {
        //   ...dataWithoutTx,
        //   tx: txHash
        // }
        const data = {
          ...dataWithoutTx,
          tx: 'a'
        }
        const res = await PROJECT.addOutput(data, projectId)
        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thành công', 'Thêm đầu ra thành công')
        } else {
          openNotificationWithIcon('error', 'Thất bại', 'Thêm đầu ra thất bại')
        }
      } catch (error) {
        console.error(error?.response?.data?.message)
        openNotificationWithIcon('error', 'Thất bại', 'Thêm đầu ra thất bại')
      }
    } else {
      alert('Đầu ra không hợp lệ. Tổng xuất cho các nhà phân phối đang nhiều hơn tổng thực tế')
    }

    handleModalAddCancel()
  }

  const handleModalUpdateOk = async (values) => {
    const images = values.upload
      ? values.upload.map((upload) => (upload.response ? upload.response.metadata.thumb_url : upload.url))
      : []
    const updatedValue = { ...values, time: values.date, amountPerOne: values['amount per one'], images: images }
    delete updatedValue.date
    delete updatedValue.upload
    delete updatedValue['amount per one']
    const data = {
      tx: 'b',
      ...updatedValue,
      distributerWithAmount: updatedValue.npp.map((item) => ({
        distributer: item.id || item.name,
        amount: item.amount
      }))
    }

    const totalNppAmount = values.npp.reduce((total, item) => total + item.amount, 0)
    if (values.amount >= totalNppAmount) {
      try {
        const res = await PROJECT.editOutput(data, projectId, selectedOutput.id)
        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
        }
      } catch (error) {
        console.error(error?.response?.data?.message)
      }
    } else {
      openNotificationWithIcon(
        'error',
        'Thông báo',
        'Đầu ra không hợp lệ. Tổng xuất cho các nhà phân phối đang nhiều hơn tổng thực tế'
      )
    }

    handleModalUpdateCancel()
  }

  const handleExportQR = async (output) => {
    try {
      console.log('output: ', output)
      const outputId = output.id
      const data = {
        amount: output.amount,
        amountPerOne: output.amountPerOne,
        distributerWithAmount: output.distributerWithAmount.map((item) => {
          return {
            distributer: item.distributer._id,
            amount: item.amount
          }
        })
      }
      const res = await PROJECT.exportQR({ projectId, outputId, data })
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Export QR thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Export QR thất bại')
      }
    } catch (error) {
      console.error(error?.response?.data?.message)
      openNotificationWithIcon('error', 'Thông báo', 'Export QR thất bại')
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleDeleteOutput = async (outputId) => {
    const res = await PROJECT.deleteOutput({ projectId: params.id, outputId: outputId })
    if (res.status === 200) {
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công')
    } else {
      openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
    }
  }

  return (
    <div>
      {contextHolder}
      {isSuccess && isSucessDistributer && isSuccessProjectInfo ? (
        <>
          <Button
            type="primary"
            onClick={() => {
              if (address) {
                setOpenAddOutput(true)
              } else {
                connect(metamaskConfig)
              }
            }}
          >
            {address ? 'Thêm đầu ra' : 'Kết nối với ví để thêm'}
          </Button>
          <OutputModal
            modalVisible={openAddOutput}
            handleModalOk={handleModalAddOk}
            handleModalCancel={handleModalAddCancel}
            selectedOutput={null}
            isUpdate={false}
            alllDistributer={alllDistributer}
          />
          <OutputModal
            modalVisible={openUpdateOutput}
            handleModalOk={handleModalUpdateOk}
            handleModalCancel={handleModalUpdateCancel}
            selectedOutput={selectedOutput}
            isUpdate={true}
            alllDistributer={alllDistributer}
          />
          <Table dataSource={outputData}>
            <Column title="Tx" dataIndex="tx" key="tx" />
            <Column title="Thời gian" key="time" render={(_, output) => <p>{formatDate(output.time)}</p>} />
            <Column title="Lượng" dataIndex="amount" key="amount" />
            <Column title="Lượng trên 1 sản phẩm" dataIndex="amountPerOne" key="amountPerOne" />
            <Column
              title="Ảnh"
              key="images"
              render={(_, output) => (
                <>
                  <Button onClick={showModal}>Xem Ảnh</Button>
                  <Modal title="Ảnh" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    {output.images ? (
                      output.images.map((image) => (
                        <span>
                          <Image class={'process-img'} src={image} />
                        </span>
                      ))
                    ) : (
                      <span>Không có ảnh</span>
                    )}
                  </Modal>
                </>
              )}
            />
            <Column
              title="Npp"
              key="npp"
              render={(_, output) => (
                <>
                  {output.distributerWithAmount ? (
                    output.distributerWithAmount.map((npp_item) => (
                      <div>
                        <p>
                          {npp_item.distributer.name} cùng lượng {npp_item.amount}
                        </p>
                      </div>
                    ))
                  ) : (
                    <span>Không có npp</span>
                  )}
                </>
              )}
            />
            <Column
              title="Chỉnh sửa"
              key="action"
              render={(_, output) => (
                <Space size="middle">
                  <Tooltip title={address ? 'Chỉnh sửa' : 'Kết nối với ví để chỉnh sửa'}>
                    {address ? (
                      <EditFilled
                        style={{ marginRight: '2rem', cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedOutput(output)
                          setOpenUpdateOutput(true)
                        }}
                        disabled={output.exportQR}
                      />
                    ) : (
                      <EditOutlined
                        style={{ marginRight: '2rem', cursor: 'pointer' }}
                        onClick={async () => {
                          await connect(metamaskConfig)
                        }}
                        disabled={output.exportQR}
                      />
                    )}
                  </Tooltip>
                  <Popconfirm
                    title="Xóa"
                    description="Bạn có chắc chắn muốn xóa không"
                    onConfirm={handleDeleteOutput.bind(this, output.id)}
                  >
                    <Tooltip title="Xóa">
                      <DeleteFilled style={{ cursor: 'pointer', marginRight: '2rem' }} disabled={output.exportQR} />
                    </Tooltip>
                  </Popconfirm>
                  <> {output.isEdited ? <EditOutputHistory output={output} /> : <></>}</>
                  <Popconfirm
                    title="Xóa"
                    description="Bạn có chắc chắn muốn export không"
                    onConfirm={handleExportQR.bind(this, output)}
                  >
                    <Button type="primary" disabled={output.exportQR}>
                      Xuất QR
                    </Button>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectOutput
