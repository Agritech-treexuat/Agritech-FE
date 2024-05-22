import React, { useState } from 'react'
import { Modal, Divider, Tooltip } from 'antd'
import { formatDateTime, formatTransactionHashTable } from '../../../../utils/helpers'
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
      <Modal
        title="Lịch sử chỉnh sửa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <>
          {expect.historyExpect.map((expect) => (
            <div key={expect.tx}>
              <Divider>{formatDateTime(expect.time)}</Divider>
              <div style={{ width: 'fit-content', marginRight: '10px' }}>
                <p>
                  <strong>Transaction hash:</strong>{' '}
                  {formatTransactionHashTable({
                    str: expect.tx,
                    a: 8,
                    b: 5
                  })}
                </p>
                <p>
                  <strong>Thời gian: </strong> {formatDateTime(expect.time)}
                </p>
                <p>
                  <strong>Lượng:</strong> {expect.amount} (kg)
                </p>
                <p>
                  <strong>Ghi chú:</strong> {expect.note}
                </p>
              </div>
            </div>
          ))}
          <div>
            <Divider>{formatDateTime(expect.time)}</Divider>
            <div style={{ width: 'fit-content', marginRight: '10px' }}>
              <p>
                <strong>Transaction hash:</strong>{' '}
                {formatTransactionHashTable({
                  str: expect.tx,
                  a: 8,
                  b: 5
                })}
              </p>
              <p>
                <strong>Thời gian: </strong> {formatDateTime(expect.time)}
              </p>
              <p>
                <strong>Lượng:</strong> {expect.amount} (kg)
              </p>
              <p>
                <strong>Ghi chú:</strong> {expect.note}
              </p>
            </div>
          </div>
        </>
      </Modal>
    </>
  )
}
export default EditExpectHistory
