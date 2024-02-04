import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import UpdateOutputForm from './UpdateOutputForm'

const UpdateOutputPopup = ({ output, disabled, refetch, alllDistributer }) => {
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
      <Button type="primary" onClick={showModal} disabled={disabled}>
        Chỉnh sửa
      </Button>
      <Modal
        title="Chỉnh sửa đầu ra"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        footer={null}
      >
        <UpdateOutputForm handleCloseForm={handleOk} output={output} refetch={refetch} alllDistributer={alllDistributer} />
      </Modal>
    </>
  )
}
export default UpdateOutputPopup
