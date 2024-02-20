import React, { useState } from 'react'
import { Modal, Divider, Tooltip } from 'antd'
import { formatDate, formatDateTime } from '../../../utils/helpers'

const EditInputHistory = ({ historyInfo }) => {
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
    <Tooltip title="Xem lịch sử chỉnh sửa">
      <p
  style={{
    fontStyle: 'italic',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'box-shadow 0.3s',
    borderBottom: '1px solid transparent',
    marginRight: '0.5rem',
    display: 'inline-block',
    color: 'grey'
  }}
  onMouseEnter={(e) => { e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.2)'; }}
  onMouseLeave={(e) => { e.target.style.boxShadow = 'none'; }}
  onClick={showModal}
>
    Đã chỉnh sửa
</p>
  </Tooltip>

      <Modal
        title="Lịch sử chỉnh sửa"
        style={{ width: 'fit-content' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {historyInfo.map((input) => (
          <div style={{ width: 'fit-content' }}>
            <Divider>Created lúc: {formatDateTime(input.createdAtTime)}</Divider>
            <Divider>Chỉnh sửa lúc: {formatDateTime(input.modifiedAt)}</Divider>
            <div>
              <label>Transaction hash: </label>
              <span>{input.txHash}</span>
            </div>
            <div>
              <label>Ngày bắt đầu: </label>
              <span>{formatDate(input.startDate)}</span>
            </div>
            <div>
              <label>Hạt giống: </label>
              <span>{input.seed.seed_name}</span>
            </div>
            <div>
              <label>Square: </label>
              <span>{input.square}</span>
            </div>
            <div>
              <label>Description: </label>
              <span>{input.description}</span>
            </div>
          </div>
        ))}
      </Modal>
    </>
  )
}
export default EditInputHistory
