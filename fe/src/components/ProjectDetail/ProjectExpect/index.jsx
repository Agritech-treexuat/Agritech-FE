import React, { useState } from 'react'
import Loading from '../../../pages/Loading'
import { useParams } from 'react-router'
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tooltip,
  notification
} from 'antd'
import EditExpectHistory from './EditExpectHistory'
import { formatDateTime, formatTransactionHashTable } from '../../../utils/helpers'
import useProjectExpect from './useProjectExpect'
import PROJECT from '../../../services/projectService'
import { DeleteFilled, EditFilled, EditOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useStateContext } from '../../../context'
import { metamaskWallet } from '@thirdweb-dev/react'
const metamaskConfig = metamaskWallet()

const { Column } = Table

const ExpectModal = ({ modalExpectVisible, handleModalOk, handleModalCancel, selectedExpect, isUpdate }) => {
  const [form] = Form.useForm()
  if (isUpdate && selectedExpect) {
    form.setFieldsValue({
      date: selectedExpect?.time ? dayjs(selectedExpect.time) : dayjs(new Date()),
      amount: selectedExpect?.amount,
      note: selectedExpect?.note
    })
  } else {
    form.setFieldsValue({
      date: dayjs(new Date())
    })
  }

  return (
    <Modal
      open={modalExpectVisible}
      title={isUpdate ? 'Cập nhật dự kiến' : 'Thêm dự kiến'}
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
            handleModalCancel()
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="amount"
          label="Lượng"
          rules={[
            {
              required: true,
              message: 'Lượng không được để trống'
            }
          ]}
          style={{ width: '100%' }}
        >
          <InputNumber addonAfter="kg" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea placeholder="Ghi chú" style={{ width: '100%' }} autoSize={{ minRows: 5 }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const ProjectExpect = () => {
  const { address, connect, insertExpect, updateExpect } = useStateContext()
  const projectId = useParams().id
  const { expectData, isSuccess, refetch, projectInfo, isSuccessProjectInfo } = useProjectExpect({ projectId })

  const [openAddExpect, setOpenAddExpect] = useState(false)
  const [openUpdateExpect, setOpenUpdateExpect] = useState(false)
  const [selectedExpect, setSelectedExpect] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingNonBlockchain, setLoadingNonBlockchain] = useState(false)

  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const handleModalAddCancel = () => {
    setOpenAddExpect(false)
  }

  const handleModalUpdateCancel = () => {
    setOpenUpdateExpect(false)
  }

  const handleModalAddOk = async (values) => {
    const updatedValue = { ...values, time: new Date() }
    delete updatedValue.date
    setLoading(true)
    try {
      const receip = await insertExpect({
        pId: projectInfo.projectIndex,
        expect: `Add expect: projectId: ${projectId}, time: ${updatedValue.time}, amount: ${updatedValue.amount}, note: ${updatedValue.note}`
      })
      const txHash = receip?.transactionHash
      if (!txHash) {
        setLoading(false)
        openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
        return
      }
      const data = {
        ...updatedValue,
        tx: txHash
      }
      setLoading(false)
      const res = await PROJECT.addExpect(data, projectId)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
      }
    } catch (error) {
      setLoading(false)
      console.error(error?.response?.data?.message)
      openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
    }
  }

  const handleModalUpdateOk = async (values) => {
    const data = {
      time: new Date(),
      amount: values.amount,
      note: values.note
    }
    setLoading(true)

    try {
      const receip = await updateExpect({
        pId: projectInfo.projectIndex,
        expect: `Update expect: projectId: ${projectId}, expectId: ${selectedExpect.id}, time: ${data.time}, amount: ${data.amount}, note: ${data.note}`
      })
      const txHash = receip?.transactionHash
      if (!txHash) {
        setLoading(false)
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
        return
      }
      console.log('txhash: ', txHash)
      const res = await PROJECT.editExpect({
        data: {
          ...data,
          tx: txHash
        },
        projectId,
        expectId: selectedExpect.id
      })
      setLoading(false)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
      }
    } catch (error) {
      setLoading(false)
      console.error(error?.response?.data?.message)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
    }
  }

  const handleDeleteExpect = async (expectId) => {
    setLoadingNonBlockchain(true)
    try {
      const res = await PROJECT.deleteExpect({ projectId, expectId: expectId })
      setLoadingNonBlockchain(false)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
      }
    } catch (error) {
      setLoadingNonBlockchain(false)
      openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
    }
  }

  return (
    <div>
      {contextHolder}
      {isSuccess && isSuccessProjectInfo ? (
        <Spin
          spinning={loading || loadingNonBlockchain}
          tip={loading ? 'Đang ghi lên Blockchain, làm ơn chờ chút ...' : ''}
          size="large"
        >
          <div>
            {contextHolder}
            <Button
              type="primary"
              onClick={() => {
                if (address) {
                  setOpenAddExpect(true)
                } else {
                  connect(metamaskConfig)
                }
              }}
              style={{ marginBottom: '15px' }}
            >
              {address ? 'Thêm dự kiến' : 'Kết nối với ví để thêm dự kiến'}
            </Button>
            <ExpectModal
              modalExpectVisible={openAddExpect}
              handleModalOk={handleModalAddOk}
              handleModalCancel={handleModalAddCancel}
              selectedExpect={null}
              isUpdate={false}
            />
            <ExpectModal
              modalExpectVisible={openUpdateExpect}
              handleModalOk={handleModalUpdateOk}
              handleModalCancel={handleModalUpdateCancel}
              selectedExpect={selectedExpect}
              isUpdate={true}
            />
            <Table dataSource={expectData}>
              <Column
                title="Thời gian"
                key="time"
                render={(_, expect) => <p>{formatDateTime(expect.time)}</p>}
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
                render={(_, expect) =>
                  formatTransactionHashTable({
                    str: expect.tx,
                    a: 8,
                    b: 5
                  })
                }
              />
              <Column title="Lượng (kg)" dataIndex="amount" key="amount" />
              <Column title="Ghi chú" dataIndex="note" key="note" />

              <Column
                title="Hành động"
                key="action"
                width="150px"
                render={(_, expect) => (
                  <Space size="middle">
                    <Tooltip title={address ? 'Chỉnh sửa' : 'Kết nối với ví để chỉnh sửa'}>
                      {address ? (
                        <EditFilled
                          style={{ marginRight: '2rem', cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedExpect(expect)
                            setOpenUpdateExpect(true)
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
                      onConfirm={handleDeleteExpect.bind(this, expect.id)}
                    >
                      <Tooltip title="Xóa">
                        <DeleteFilled style={{ cursor: 'pointer', marginRight: '2rem' }} />
                      </Tooltip>
                    </Popconfirm>
                    <> {expect.isEdited ? <EditExpectHistory expect={expect} /> : <></>}</>
                  </Space>
                )}
              />
            </Table>
          </div>
        </Spin>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectExpect
