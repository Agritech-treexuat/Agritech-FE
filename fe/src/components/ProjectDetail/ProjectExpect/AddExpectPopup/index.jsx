import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import AddExpectForm from './AddExpectForm'

const AddExpectPopup = ({ refetch, openNotificationWithIcon }) => {
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
  return (
    <>
      <Button type="primary" onClick={showModal} style={{ marginBottom: '15px' }}>
        Thêm dự kiến
      </Button>
      <Modal title="Thêm dự kiến" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <AddExpectForm
          handleCloseForm={handleOk}
          refetch={refetch}
          openNotificationWithIcon={openNotificationWithIcon}
        />
      </Modal>
    </>
  )
}
export default AddExpectPopup
