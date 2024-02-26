import React, { useState } from 'react'
import { Modal, Image, Divider, Tooltip, List } from 'antd'
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
      <Modal
        title="Lịch sử chỉnh sửa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {output.historyOutput.map((output) => (
          <>
            <Divider>Nhập lúc: {formatDateTime(output.createdAtTime)}</Divider>
            <Divider>Chỉnh sửa lúc: {formatDateTime(output.modifiedAt)}</Divider>
            <div style={{ width: 'fit-content', marginRight: '10px' }}>
              <p>
                <strong>Transaction hash: </strong>{' '}
                <a href={`https://escan.live/tx/${output.tx}`} target="_blank" rel="noreferrer">{`${output.tx}`}</a>
              </p>
              <p>
                <strong>Thời gian: </strong> {output.time}
              </p>
              <p>
                <strong>Lượng:</strong> {output.amount}
              </p>
              <p>
                <strong>Lượng trên 1 sản phẩm:</strong> {output.amountPerOne}
              </p>

              <div>
                <p>
                  <strong>Danh sách nhà phân phối cùng lượng giao tương ứng: </strong>
                </p>
                <ul>
                  {output.distributerWithAmount ? (
                    output.distributerWithAmount.map((npp_item) => (
                      <li>
                        <p>
                          {npp_item.distributer.name} cùng lượng {npp_item.amount}
                        </p>
                      </li>
                    ))
                  ) : (
                    <li>Không có nhà phân phối</li>
                  )}
                </ul>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p>
                  <strong>Ảnh: </strong>
                </p>
                {output.images ? (
                  // output.images.map((image) => (
                  //   <span>
                  //     <Image className={'process-img'} src={image} width={200}/>
                  //   </span>
                  // ))
                  <List
                    grid={{
                      gutter: 4,
                      xs: 1,
                      sm: 2,
                      md: 2,
                      lg: 2,
                      xl: 2,
                      xxl: 2
                    }}
                    dataSource={output.images}
                    renderItem={(item) => (
                      <List.Item>
                        <Image className={'process-img'} src={item} width={200} style={{ borderRadius: '5px' }} />
                      </List.Item>
                    )}
                  />
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
