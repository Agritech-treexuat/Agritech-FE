import React, { useState } from 'react'
import { Button, Modal, Form } from 'antd'
import UpdateInputForm from './UpdateInputForm'
import { useParams } from 'react-router-dom'
import PROJECT from '../../../services/projectService'

const UpdateInputPopup = ({ input, refetch }) => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const projectId = useParams().id

  const handleUpdateOverview = async (values) => {
    const data = {
      startDate: values.date,
      square: values.square,
      description: values.description
    }
    try {
      await PROJECT.editProjectInfo(data, projectId)
      refetch()
    } catch (error) {
      console.error(error?.response?.data?.message)
    }
    setIsModalOpen(false)
  }

  return (
    <>
      <Button style={{ marginRight: '6px' }} type="primary" onClick={() => setIsModalOpen(true)}>
        Chỉnh sửa
      </Button>
      <Modal
        title="Chỉnh sửa đầu vào"
        open={isModalOpen}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields()
              handleUpdateOverview(values)
            })
            .catch((info) => {
              console.log('Validate Failed:', info)
            })
        }}
        onCancel={() => setIsModalOpen(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <UpdateInputForm input={input} form={form} />
      </Modal>
    </>
  )
}
export default UpdateInputPopup
