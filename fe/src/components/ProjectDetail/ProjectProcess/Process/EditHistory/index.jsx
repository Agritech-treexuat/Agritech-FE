import React, { useState } from 'react'
import { Button, Modal, Divider } from 'antd'
import { formatDate, formatDateTime } from '../../../../../utils/helpers'
const EditHistory = ({ process }) => {
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
        {process.historyProcess.map((process) => (
          <>
            <Divider>Chỉnh sửa lúc: {formatDateTime(process.modifiedAt)}</Divider>
            <div style={{ width: 'fit-content', marginRight: '10px' }}>
              <p>Transaction hash: {process.tx}</p>
              <p>Thời gian: {formatDate(process.time)}</p>
              <p>Loại canh tác: {process.type}</p>
              {process.type === 'phân bón' || process.type === 'BVTV' ? (
                <div>
                  {process.agroChemicalItems.map((item) => (
                    <ul>
                      <li>
                        Tên: {item.name}, {item.amountPerHa} {process.type === 'phân bón' ? 'kg/ha' : 'lit/ha'}
                      </li>
                    </ul>
                  ))}
                  <p>Ghi chú: {process.note}</p>
                </div>
              ) : (
                <p>Ghi chú: {process.note}</p>
              )}
            </div>
          </>
        ))}
      </Modal>
    </>
  )
}
export default EditHistory
