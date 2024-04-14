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
  Tooltip,
  Spin,
  List
} from 'antd'
import { formatDate, formatTransactionHashTable } from '../../../utils/helpers'
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
import HASH from '../../../services/hashService'
import QR from '../../../services/qrService'
import { baseUrl } from '../../../services/http/baseUrl'
import md5 from 'md5'
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
    selectedOutput?.images?.map((image, index) => ({
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
        upload: selectedOutput.images?.map((image, index) => ({
          uid: String(-index),
          name: `image-${index}.png`,
          status: 'done',
          url: image
        }))
      })
      setFileList(
        selectedOutput?.images?.map((image, index) => ({
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
    action: `${baseUrl}/upload/single`,
    multiple: true,
    method: 'post',
    accept: 'image/*',
    name: 'file',
    headers: {
      authorization: getAccessToken(),
      'x-rtoken-id': getRefreshToken()
    },
    onChange: (info) => {
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
            handleModalCancel()
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
                upload: selectedOutput.images?.map((image, index) => ({
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
                      placeholder="Lựa chọn nhà phân phối"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      options={alllDistributer.map((distributer) => ({
                        value: distributer.id,
                        label: distributer.name
                      }))}
                      style={{ width: 200 }}
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
  const [loading, setLoading] = useState(false)
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { address, connect, insertOutput, updateOutput, generateQR } = useStateContext()
  const [openAddOutput, setOpenAddOutput] = useState(false)
  const [openUpdateOutput, setOpenUpdateOutput] = useState(false)
  const [selectedOutput, setSelectedOutput] = useState(null)
  const [selectedOutputImages, setSelectedOutputImages] = useState(null)

  const handleModalAddCancel = () => {
    setOpenAddOutput(false)
  }

  const handleModalUpdateCancel = () => {
    setOpenUpdateOutput(false)
  }

  const transformDataWriteAddBlockChain = async (dataWithoutTx, alllDistributer) => {
    try {
      // Biến đổi distributerWithAmount
      const transformedDistributerWithAmount = dataWithoutTx.distributerWithAmount.map(({ distributer, amount }) => {
        const distributerName = alllDistributer.find((item) => item.id === distributer)?.name || ''
        return { distributer: distributerName, amount }
      })

      const resHashImages = await HASH.hashImages({ data: { images: dataWithoutTx.images } })
      let hashedImages = ''
      if (resHashImages.status === 200) {
        hashedImages = resHashImages.data?.metadata.join(' - ')
      }

      // Tạo object mới
      const transformedData = {
        ...dataWithoutTx,
        distributerWithAmount: transformedDistributerWithAmount,
        hashedImages: hashedImages
      }

      // return string
      const outputString = `Add output: projectId: ${projectId}, time: ${transformedData.time}, amount: ${
        transformedData.amount
      }, amountPerOne: ${transformedData.amountPerOne}, exportQR: ${
        transformedData.exportQR
      }, distributerWithAmount: ${transformedData.distributerWithAmount
        .map((item) => `${item.distributer} - ${item.amount}`)
        .join('+ ')}, hashedImages: ${transformedData.hashedImages}`
      return outputString
    } catch (error) {
      throw new Error('Đã xảy ra lỗi trong quá trình biến đổi dữ liệu: ' + error.message)
    }
  }

  const transformDataWriteUpdateBlockChain = async (dataWithoutTx, alllDistributer, outputId) => {
    try {
      // Biến đổi distributerWithAmount
      const transformedDistributerWithAmount = dataWithoutTx.distributerWithAmount.map(({ distributer, amount }) => {
        const distributerName = alllDistributer.find((item) => item.id === distributer)?.name || ''
        return { distributer: distributerName, amount }
      })

      const resHashImages = await HASH.hashImages({ data: { images: dataWithoutTx.images } })
      let hashedImages = ''
      if (resHashImages.status === 200) {
        hashedImages = resHashImages.data?.metadata.join(' - ')
      }

      // Tạo object mới
      const transformedData = {
        ...dataWithoutTx,
        distributerWithAmount: transformedDistributerWithAmount,
        hashedImages: hashedImages
      }

      // return string
      const outputString = `Update output: projectId: ${projectId}, outputId: ${outputId}, time: ${
        transformedData.time
      }, amount: ${transformedData.amount}, amountPerOne: ${transformedData.amountPerOne}, exportQR: ${
        transformedData.exportQR
      }, distributerWithAmount: ${transformedData.distributerWithAmount
        .map((item) => `${item.distributer} - ${item.amount}`)
        .join('+ ')}, hashedImages: ${transformedData.hashedImages}`
      return outputString
    } catch (error) {
      throw new Error('Đã xảy ra lỗi trong quá trình biến đổi dữ liệu: ' + error.message)
    }
  }

  const handleModalAddOk = async (values) => {
    setLoading(true)
    const images = values.upload ? values.upload.map((upload) => upload.response.metadata.thumb_url) : []
    const updatedValue = {
      ...values,
      time: values.date.toDate(),
      amountPerOne: values['amount per one'],
      images: images
    }
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

    const outputString = await transformDataWriteAddBlockChain(dataWithoutTx, alllDistributer)

    const totalNppAmount = values.npp ? values.npp.reduce((total, item) => total + item.amount, 0) : 0

    if (values.amount >= totalNppAmount) {
      try {
        const receip = await insertOutput({
          pId: projectInfo.projectIndex,
          output: outputString
        })
        const txHash = receip?.transactionHash
        if (!txHash) {
          openNotificationWithIcon('error', 'Thất bại', 'Thêm đầu ra thất bại')
          setLoading(false)
          return
        }
        const data = {
          ...dataWithoutTx,
          tx: txHash
        }
        setLoading(false)
        const res = await PROJECT.addOutput(data, projectId)
        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thành công', 'Thêm đầu ra thành công')
        } else {
          openNotificationWithIcon('error', 'Thất bại', 'Thêm đầu ra thất bại')
        }
      } catch (error) {
        setLoading(false)
        console.error(error?.response?.data?.message)
        openNotificationWithIcon('error', 'Thất bại', 'Thêm đầu ra thất bại')
      }
    } else {
      alert('Đầu ra không hợp lệ. Tổng xuất cho các nhà phân phối đang nhiều hơn tổng thực tế')
    }
  }

  const handleModalUpdateOk = async (values) => {
    setLoading(true)
    const images = values.upload
      ? values.upload.map((upload) => (upload.response ? upload.response.metadata.thumb_url : upload.url))
      : []
    const updatedValue = { ...values, time: values.date, amountPerOne: values['amount per one'], images: images }
    delete updatedValue.date
    delete updatedValue.upload
    delete updatedValue['amount per one']
    const dataWithoutTx = {
      ...updatedValue,
      distributerWithAmount: updatedValue.npp.map((item) => ({
        distributer: item.id || item.name,
        amount: item.amount
      }))
    }
    const outputString = await transformDataWriteUpdateBlockChain(dataWithoutTx, alllDistributer, selectedOutput.id)

    const totalNppAmount = values.npp.reduce((total, item) => total + item.amount, 0)
    if (values.amount >= totalNppAmount) {
      try {
        const receip = await updateOutput({
          pId: projectInfo.projectIndex,
          output: outputString
        })
        const txHash = receip?.transactionHash
        if (!txHash) {
          openNotificationWithIcon('error', 'Thất bại', 'Cập nhật đầu ra thất bại')
          setLoading(false)
          return
        }
        const data = {
          ...dataWithoutTx,
          tx: txHash
        }
        setLoading(false)
        const res = await PROJECT.editOutput(data, projectId, selectedOutput.id)
        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
        }
      } catch (error) {
        setLoading(false)
        console.error(error?.response?.data?.message)
      }
    } else {
      setLoading(false)
      openNotificationWithIcon(
        'error',
        'Thông báo',
        'Đầu ra không hợp lệ. Tổng xuất cho các nhà phân phối đang nhiều hơn tổng thực tế'
      )
    }
  }

  const handleExportQR = async (output) => {
    setLoading(true)
    try {
      // const numberOfQR = output.distributerWithAmount.reduce((total, item) => total + item.amount / output.amountPerOne + 1, 0)
      // const privateIds = []
      // // generate numberOfQR unique privateIds
      // for (let i = 0; i < numberOfQR; i++) {
      //   privateIds.push(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
      // }
      let numberOfQR = 0
      let privateIds = []
      for (let i = 0; i < output.distributerWithAmount.length; i++) {
        let numberofQREachDistributer = Math.ceil(output.distributerWithAmount[i].amount / output.amountPerOne) + 1
        let privateIdsEachDistributer = []
        numberOfQR += numberofQREachDistributer
        for (let j = 0; j < numberofQREachDistributer; j++) {
          privateIdsEachDistributer.push(
            Math.random().toString(36).substring(2, 15) +
              Math.random().toString(36).substring(2, 15) +
              Math.random().toString(36).substring(2, 15)
          )
        }
        output.distributerWithAmount[i].privateIdsEachDistributer = privateIdsEachDistributer
        privateIds.push(...privateIdsEachDistributer)
      }
      const outputId = output.id
      const generateQRInfo = `Time: ${new Date()}, ProjectId: ${projectId}, OutputId: ${outputId}, DistributerWithAmount: ${output.distributerWithAmount
        .map((item) => `${item.distributer.name} - ${Math.ceil(item.amount / output.amountPerOne) + 1}`)
        .join('+ ')}`

      console.log('generateQRInfo: ', generateQRInfo)

      // timeGenerate = unix time stamp of current time
      const timeGenerate = Math.floor(new Date().getTime() / 1000)

      const receip = await generateQR({
        projectId,
        numberOfQR,
        privateIds,
        generateQRInfo,
        timeGenerate
      })

      const txExport = receip?.transactionHash
      if (!txExport) {
        openNotificationWithIcon('error', 'Thông báo', 'Export QR thất bại')
        setLoading(false)
        return
      }
      const data = {
        amount: output.amount,
        amountPerOne: output.amountPerOne,
        distributerWithAmount: output.distributerWithAmount.map((item) => {
          return {
            distributer: item.distributer._id,
            amount: item.amount,
            numberOfQR: Math.ceil(item.amount / output.amountPerOne) + 1,
            privateIdsEachDistributer: item.privateIdsEachDistributer.map((privateId) => md5(privateId))
          }
        }),
        txExport
      }

      const res = await QR.exportQR({ projectId, outputId, data })
      setLoading(false)
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
        <Spin spinning={loading} tip="Đang ghi lên Blockchain, làm ơn chờ chút ...">
          <>
            <Button
              type="primary"
              onClick={() => {
                if (address) {
                  setOpenAddOutput(true)
                } else {
                  setLoading(true)
                  connect(metamaskConfig)
                  setLoading(false)
                }
              }}
              style={{ marginBottom: '15px' }}
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
            <Modal title="Ảnh" open={isModalOpen} footer={null} onCancel={handleCancel} width={600}>
              {/* {selectedOutputImages?.images ? (
                selectedOutputImages?.images?.map((image) => (
                  <span>
                    <Image class={'process-img'} src={image} />
                  </span>
                ))
              ) : (
                <span>Không có ảnh</span>
              )} */}
              {selectedOutputImages?.images ? (
                <List
                  grid={{
                    gutter: 4,
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 2,
                    xl: 2,
                    xxl: 2
                  }}
                  dataSource={selectedOutputImages.images}
                  renderItem={(item) => (
                    <List.Item>
                      <Image className={'process-img'} src={item} width={250} style={{ borderRadius: '5px' }} />
                    </List.Item>
                  )}
                />
              ) : (
                <span>Không có ảnh</span>
              )}
            </Modal>

            <Table dataSource={outputData}>
              <Column
                title="Thời gian"
                key="time"
                render={(_, output) => <p>{formatDate(output.time)}</p>}
                sorter={(a, b) => new Date(a.time) - new Date(b.time)}
                showSorterTooltip={{
                  title: 'Sắp xếp thời gian'
                }}
                width="150px"
              />
              <Column
                title="Transaction hash"
                dataIndex="tx"
                key="tx"
                width="150px"
                render={(_, output) =>
                  formatTransactionHashTable({
                    str: output.tx,
                    a: 8,
                    b: 6
                  })
                }
              />
              <Column title="Lượng (kg)" dataIndex="amount" key="amount" />
              <Column title="Lượng trên 1 sản phẩm (kg)" dataIndex="amountPerOne" key="amountPerOne" />
              <Column
                title="Ảnh"
                key="images"
                render={(_, output) => (
                  <>
                    <Button
                      onClick={() => {
                        setSelectedOutputImages(output)
                        setIsModalOpen(true)
                      }}
                    >
                      Xem Ảnh
                    </Button>
                  </>
                )}
              />
              <Column
                title="Nhà phân phối"
                key="npp"
                render={(_, output) => (
                  <>
                    {output.distributerWithAmount ? (
                      output.distributerWithAmount.map((npp_item) => (
                        <div key={npp_item?.distributer?.name}>
                          <p>
                            {npp_item?.distributer?.name} cùng lượng {npp_item?.amount} (kg)
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
                            setLoading(true)
                            await connect(metamaskConfig)
                            setLoading(false)
                          }}
                          disabled={output.exportQR}
                        />
                      )}
                    </Tooltip>
                    <Popconfirm
                      title="Xóa"
                      description="Bạn có chắc chắn muốn xóa không"
                      onConfirm={handleDeleteOutput.bind(this, output.id)}
                      disabled={output.exportQR}
                    >
                      <Tooltip title="Xóa">
                        <DeleteFilled style={{ cursor: 'pointer', marginRight: '2rem' }} disabled={output.exportQR} />
                      </Tooltip>
                    </Popconfirm>
                    <> {output.isEdited ? <EditOutputHistory output={output} /> : <></>}</>
                    <Popconfirm
                      title="Xuất QR"
                      description={address ? 'Bạn có chắc chắn muốn xuất QR không' : 'Kết nối với ví để xuất QR'}
                      onConfirm={
                        address
                          ? handleExportQR.bind(this, output)
                          : async () => {
                              setLoading(true)
                              await connect(metamaskConfig)
                              setLoading(false)
                            }
                      }
                      okText="Xác nhận"
                      cancelText="Hủy"
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
        </Spin>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectOutput
