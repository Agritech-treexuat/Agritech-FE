import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import AddOutputForm from './AddOutputForm'
import { useStateContext } from '../../../../context'
import { metamaskWallet } from '@thirdweb-dev/react'
const metamaskConfig = metamaskWallet()

const AddOutputPopup = ({ refetch, alllDistributer, openNotificationWithIcon, projectIndex }) => {
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
      <Button type="primary" onClick={showModal}>
        {address ? 'Thêm đầu ra' : 'Kết nối với ví để thêm'}
      </Button>
      <Modal title="Thêm đầu ra" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <AddOutputForm
          handleCloseForm={handleOk}
          refetch={refetch}
          alllDistributer={alllDistributer}
          openNotificationWithIcon={openNotificationWithIcon}
          projectIndex={projectIndex}
        />
      </Modal>
    </>
  )
}
export default AddOutputPopup
