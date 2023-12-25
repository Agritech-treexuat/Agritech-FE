import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import UpdateInputForm from './UpdateInputForm'

const UpdateInputPopup = ({ input, setInitData }) => {
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
      <Button style={{ marginRight: '6px' }} type="primary" onClick={showModal}>
        Chỉnh sửa
      </Button>
      <Modal
        title="Chỉnh sửa đầu vào"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Cập nhật"
        footer={null}
      >
        <UpdateInputForm handleCloseForm={handleOk} input={input} setInitData={setInitData} />
      </Modal>
    </>
  )
}
export default UpdateInputPopup
