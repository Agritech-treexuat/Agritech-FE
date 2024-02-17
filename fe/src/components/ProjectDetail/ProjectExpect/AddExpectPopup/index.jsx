import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import AddExpectForm from './AddExpectForm'
import { useStateContext } from '../../../../context'
import { metamaskWallet } from '@thirdweb-dev/react'
const metamaskConfig = metamaskWallet()

const AddExpectPopup = ({ refetch, openNotificationWithIcon, projectIndex }) => {
  const { connect, address } = useStateContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    if (address) {
      setIsModalOpen(true)
    } else {
      connect(metamaskConfig)
    }
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
        {address ? 'Thêm dự kiến' : 'connect'}
      </Button>
      <Modal title="Thêm dự kiến" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <AddExpectForm
          handleCloseForm={handleOk}
          refetch={refetch}
          openNotificationWithIcon={openNotificationWithIcon}
          projectIndex={projectIndex}
        />
      </Modal>
    </>
  )
}
export default AddExpectPopup
