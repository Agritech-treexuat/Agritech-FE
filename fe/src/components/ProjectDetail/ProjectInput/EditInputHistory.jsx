import React, { useState } from 'react'
import { Modal, Divider, Tooltip, Typography } from 'antd'
import { formatDate, formatDateTime, formatTransactionHashTable } from '../../../utils/helpers'
const { Paragraph } = Typography

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

  console.log('historyInfo', historyInfo)
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
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none'
          }}
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
        width={600}
      >
        {historyInfo.map((input) => (
          <div key={input.txHash} style={{ width: 'fit-content' }}>
            <Divider>Nhập lúc: {formatDateTime(input.createdAtTime)}</Divider>
            <Divider>Chỉnh sửa lúc: {formatDateTime(input.modifiedAt)}</Divider>
            <div>
              <label>
                <strong>Transaction hash: </strong>
              </label>
              <span>
                <p>
                  {' '}
                  {formatTransactionHashTable({
                    str: input.txHash,
                    a: 8,
                    b: 5
                  })}
                </p>
              </span>
            </div>
            <div>
              <label>
                <strong>Ngày bắt đầu: </strong>{' '}
              </label>
              <span>{formatDate(input.startDate)}</span>
            </div>
            <div>
              <label>
                <strong>Hạt giống: </strong>
              </label>
              <span>{input.seed.seed_name}</span>
            </div>
            <div>
              <label>
                <strong>Diện tích: </strong>
              </label>
              <span>{input.square || 'Chưa cập nhật'}</span>
            </div>
            <div style={{ display: 'flex' }}>
              <label style={{ marginRight: '5px' }}>
                <strong>Mô tả: </strong>
              </label>
              <span>
                {
                  <Paragraph
                    ellipsis={{
                      rows: 3,
                      expandable: true,
                      symbol: 'đọc thêm',
                      tooltip: true,
                      onExpand: function (event) {
                        console.log('onExpand', event)
                        event.stopPropagation()
                        event.preventDefault()
                      }
                    }}
                  >
                    {input.description}
                  </Paragraph>
                }
              </span>
            </div>
          </div>
        ))}
      </Modal>
    </>
  )
}
export default EditInputHistory
