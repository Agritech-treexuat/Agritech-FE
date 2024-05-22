import React, { useState } from 'react'
import { Modal, Image, Divider, Tooltip, List } from 'antd'
import { formatDateTime, formatTransactionHashTable } from '../../../../utils/helpers'
import { HistoryOutlined } from '@ant-design/icons'

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
          <div key={output.tx}>
            <Divider>{formatDateTime(output.createdAtTime)}</Divider>
            <div style={{ width: 'fit-content', marginRight: '10px' }}>
              <p>
                <strong>Transaction hash: </strong>{' '}
                {formatTransactionHashTable({
                  str: output.tx,
                  a: 8,
                  b: 5
                })}
              </p>
              <p>
                <strong>Thời gian: </strong> {formatDateTime(output.time)}
              </p>
              <p>
                <strong>Lượng:</strong> {output.amount} (kg)
              </p>
              <p>
                <strong>Số lượng sản phẩm:</strong> {output.quantity}
              </p>

              <div>
                <p>
                  <strong>Danh sách nhà phân phối cùng lượng giao tương ứng: </strong>
                </p>
                <ul>
                  {output.distributerWithAmount ? (
                    output.distributerWithAmount.map((npp_item) => (
                      <li key={npp_item?.distributer?.name}>
                        <p>
                          {npp_item?.distributer?.name} cùng số lượng {npp_item?.quantity} sản phẩm
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
          </div>
        ))}
        <div>
          <Divider>{formatDateTime(output.createdAtTime)}</Divider>
          <div style={{ width: 'fit-content', marginRight: '10px' }}>
            <p>
              <strong>Transaction hash: </strong>{' '}
              {formatTransactionHashTable({
                str: output.tx,
                a: 8,
                b: 5
              })}
            </p>
            <p>
              <strong>Thời gian: </strong> {formatDateTime(output.time)}
            </p>
            <p>
              <strong>Lượng:</strong> {output.amount} (kg)
            </p>
            <p>
              <strong>Số lượng sản phẩm:</strong> {output.quantity}
            </p>

            <div>
              <p>
                <strong>Danh sách nhà phân phối cùng lượng giao tương ứng: </strong>
              </p>
              <ul>
                {output.distributerWithAmount ? (
                  output.distributerWithAmount.map((npp_item) => (
                    <li key={npp_item?.distributer?.name}>
                      <p>
                        {npp_item?.distributer?.name} cùng số lượng {npp_item?.quantity} sản phẩm
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
        </div>
      </Modal>
    </>
  )
}
export default EditOutputHistory
