import React, { useState } from 'react'
import { Button, Modal, Divider } from 'antd'
import { formatDate, formatDateTime } from '../../../../utils/helpers'
const EditExpectHistory = ({ expect }) => {
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
        Lịch sử chỉnh sửa
      </Button>
      <Modal title="Lịch sử chỉnh sửa" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        {expect.historyExpect.map((expect) => (
          <>
            <Divider>Created lúc: {formatDateTime(expect.createdAtTime)}</Divider>
            <Divider>Chỉnh sửa lúc: {formatDateTime(expect.modifiedAt)}</Divider>
            <div style={{ width: 'fit-content', marginRight: '10px' }}>
              <p>Tx: {expect.tx}</p>
              <p>Thời gian: {formatDate(expect.time)}</p>
              <p>Lượng: {expect.amount}</p>
              <p>Ghi chú: {expect.note}</p>
            </div>
          </>
        ))}
      </Modal>
    </>
  )
}
export default EditExpectHistory
