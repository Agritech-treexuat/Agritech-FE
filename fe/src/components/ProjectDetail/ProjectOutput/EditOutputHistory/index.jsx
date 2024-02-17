import React, { useState } from 'react'
import { Button, Modal, Image, Divider } from 'antd'
import { formatDateTime } from '../../../../utils/helpers'

const EditOutputHistory = ({ output }) => {
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
        {output.historyOutput.map((output) => (
          <>
            <Divider>Created lúc: {formatDateTime(output.createdAtTime)}</Divider>
            <Divider>Chỉnh sửa lúc: {formatDateTime(output.modifiedAt)}</Divider>
            <div style={{ width: 'fit-content', marginRight: '10px' }}>
              <p>Tx: {output.tx}</p>
              <p>Thời gian: {output.time}</p>
              <p>Lượng: {output.amount}</p>
              <p>Lượng trên 1 sản phẩm: {output.amountPerOne}</p>

              <div>
                {output.npp ? (
                  output.npp.map((npp_item) => (
                    <div>
                      <p>
                        NPP: {npp_item.name} with amount: {npp_item.amount}
                      </p>
                    </div>
                  ))
                ) : (
                  <span>Không có npp</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {output.images ? (
                  output.images.map((image) => (
                    <span>
                      <Image class={'process-img'} src={image} />
                    </span>
                  ))
                ) : (
                  <span>Không có ảnh</span>
                )}
              </div>
            </div>
          </>
        ))}
      </Modal>
    </>
  )
}
export default EditOutputHistory
