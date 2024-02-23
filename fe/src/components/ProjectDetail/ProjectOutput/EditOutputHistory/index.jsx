import React, { useState } from 'react'
import { Modal, Image, Divider, Tooltip } from 'antd'
import { formatDateTime } from '../../../../utils/helpers'
import { HistoryOutlined } from '@ant-design/icons'

const EditOutputHistory = ({ output }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  console.log('Output: ', output)

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
        {output.historyOutput.map((output) => (
          <>
            <Divider>Created lúc: {formatDateTime(output.createdAtTime)}</Divider>
            <Divider>Chỉnh sửa lúc: {formatDateTime(output.modifiedAt)}</Divider>
            <div style={{ width: 'fit-content', marginRight: '10px' }}>
              <p>
                Tx: <a href={`https://escan.live/tx/${output.tx}`} target="_blank" rel="noreferrer">{`${output.tx}`}</a>
              </p>
              <p>Thời gian: {output.time}</p>
              <p>Lượng: {output.amount}</p>
              <p>Lượng trên 1 sản phẩm: {output.amountPerOne}</p>

              <div>
                {output.distributerWithAmount ? (
                  output.distributerWithAmount.map((npp_item) => (
                    <div>
                      <p>
                        {npp_item.distributer.name} cùng lượng {npp_item.amount}
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
                      <Image className={'process-img'} src={image} />
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
