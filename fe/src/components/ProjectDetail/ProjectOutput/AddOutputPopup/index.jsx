import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import AddOutputForm from './AddOutputForm'

const AddOutputPopup = ({ refetch, alllDistributer, openNotificationWithIcon }) => {
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
        Thêm đầu ra
      </Button>
      <Modal title="Thêm đầu ra" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <AddOutputForm
          handleCloseForm={handleOk}
          refetch={refetch}
          alllDistributer={alllDistributer}
          openNotificationWithIcon={openNotificationWithIcon}
        />
      </Modal>
    </>
  )
}
export default AddOutputPopup
