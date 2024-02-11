import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import UpdateExpectForm from './UpdateExpectForm'

const UpdateExpectPopup = ({ expect, refetch }) => {
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
      <Button type="primary" onClick={showModal}>
        Chỉnh sửa
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        footer={null}
      >
        <UpdateExpectForm handleCloseForm={handleOk} expect={expect} refetch={refetch} />
      </Modal>
    </>
  )
}
export default UpdateExpectPopup
