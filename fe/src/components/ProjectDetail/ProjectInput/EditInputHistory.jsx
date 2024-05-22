import React, { useState } from 'react'
import { Modal, Divider, Tooltip, Typography } from 'antd'
import { formatDate, formatDateTime, formatTransactionHashTable } from '../../../utils/helpers'
const { Paragraph } = Typography

const EditInputHistory = ({ historyInfo, projectInfo }) => {
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
            <Divider>{formatDateTime(input.createdAtTime)}</Divider>
            <div>
              <label>
                <strong>Transaction hash: </strong>
              </label>
              <span>
                {formatTransactionHashTable({
                  str: input.txHash,
                  a: 8,
                  b: 5
                })}
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
                <strong>Ngày kết thúc dự kiến: </strong>
              </label>
              <span>{formatDate(input.expectedEndDate)}</span>
            </div>
            <div>
              <label>
                <strong>Sản lượng dự kiến: </strong>
              </label>
              <span>{input.expectedOutput || 'Chưa cập nhật'}</span>
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
        <div key={projectInfo.txHash} style={{ width: 'fit-content' }}>
          <Divider>{formatDateTime(projectInfo.createdAtTime)}</Divider>
          <div>
            <label>
              <strong>Transaction hash: </strong>
            </label>
            <span>
              {formatTransactionHashTable({
                str: projectInfo.txHash,
                a: 8,
                b: 5
              })}
            </span>
          </div>
          <div>
            <label>
              <strong>Ngày bắt đầu: </strong>{' '}
            </label>
            <span>{formatDate(projectInfo.startDate)}</span>
          </div>
          <div>
            <label>
              <strong>Ngày kết thúc dự kiến: </strong>
            </label>
            <span>{formatDate(projectInfo.expectedEndDate)}</span>
          </div>
          <div>
            <label>
              <strong>Sản lượng dự kiến: </strong>
            </label>
            <span>{projectInfo.expectedOutput || 'Chưa cập nhật'}</span>
          </div>
          <div>
            <label>
              <strong>Hạt giống: </strong>
            </label>
            <span>{projectInfo.seed.seed_name}</span>
          </div>
          <div>
            <label>
              <strong>Diện tích: </strong>
            </label>
            <span>{projectInfo.square || 'Chưa cập nhật'}</span>
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
                  {projectInfo.description}
                </Paragraph>
              }
            </span>
          </div>
        </div>
      </Modal>
    </>
  )
}
export default EditInputHistory
