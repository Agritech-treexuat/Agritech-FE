import React, { useState } from 'react'
import { Button, Modal, Divider, Tooltip } from 'antd'
import { formatDate, formatDateTime } from '../../../../utils/helpers'
import { HistoryOutlined } from '@ant-design/icons'
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
      <Tooltip title="Xem lịch sử chỉnh sửa">
        <HistoryOutlined style={{ cursor: 'pointer' }} onClick={showModal} />
      </Tooltip>
      <Modal title="Lịch sử chỉnh sửa" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        {expect.historyExpect.map((expect) => (
          <>
            <Divider>Created lúc: {formatDateTime(expect.createdAtTime)}</Divider>
            <Divider>Chỉnh sửa lúc: {formatDateTime(expect.modifiedAt)}</Divider>
            <div style={{ width: 'fit-content', marginRight: '10px' }}>
              <p>
                Tx:{' '}
                <a href={`https://escan.live/tx/${expect.tx}`} target="_blank">
                  {expect.tx}
                </a>
              </p>
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
