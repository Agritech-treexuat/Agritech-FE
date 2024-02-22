import React, { useState } from 'react'
import { Button, Modal, Tooltip } from 'antd'
import UpdateExpectForm from './UpdateExpectForm'
import { metamaskWallet } from '@thirdweb-dev/react'
import { EditFilled, EditOutlined } from '@ant-design/icons'
import { useStateContext } from '../../../../context'
const metamaskConfig = metamaskWallet()

const UpdateExpectPopup = ({ expect, refetch, openNotificationWithIcon, projectIndex }) => {
  const { address, connect } = useStateContext()
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
      <Tooltip title={address ? 'Chỉnh sửa' : 'Kết nối với ví để chỉnh sửa'}>
        {address ? (
          <EditFilled style={{ marginRight: '2rem', cursor: 'pointer' }} onClick={showModal} />
        ) : (
          <EditOutlined
            style={{ marginRight: '2rem', cursor: 'pointer' }}
            onClick={async () => {
              await connect(metamaskConfig)
            }}
          />
        )}
      </Tooltip>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        footer={null}
      >
        <UpdateExpectForm
          handleCloseForm={handleOk}
          expect={expect}
          refetch={refetch}
          openNotificationWithIcon={openNotificationWithIcon}
          projectIndex={projectIndex}
        />
      </Modal>
    </>
  )
}
export default UpdateExpectPopup
