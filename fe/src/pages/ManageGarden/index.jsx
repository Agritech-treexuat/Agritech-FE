import React from 'react'
import { Input, Button, Flex, DatePicker } from 'antd'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import { Card } from 'antd'
import { formatDateTime } from '../../utils/helpers'
import useManageGarden from './useManageGarden'

const { Meta } = Card
const ManageGarden = () => {
  const onChange = (date, dateString) => {
    console.log(date, dateString)
  }

  const { gardens, isSuccess } = useManageGarden()
  return (
    <div>
      {isSuccess ? (
        <div>
          <h2 style={{ textAlign: 'left' }}>Quản lý mảnh vườn TRỒNG RAU HỘ</h2>
          {/* Sreach request */}
          <div>
            <p>
              <strong>Tìm kiếm thông tin</strong>
            </p>
            <Flex style={{ marginBottom: '2rem' }} align="flex-end">
              <Flex vertical style={{ marginRight: '1rem' }}>
                <label style={{ marginBottom: '0.5rem' }}>Nội dung/Tên người đặt/Template đơn hàng: </label>
                <Input style={{ width: '100%' }} placeholder="Tìm kiếm" />
              </Flex>
              <Flex vertical style={{ marginRight: '1rem' }}>
                <label style={{ marginBottom: '0.5rem' }}>Ngày đặt hàng: </label>
                <DatePicker onChange={onChange} />
              </Flex>
              <Flex gap="small" wrap="wrap">
                <Button type="primary">Tìm kiếm</Button>
                <Button>Đặt lại</Button>
              </Flex>
            </Flex>
          </div>
          <h2 style={{ textAlign: 'left', fontSize: '18px' }}>Danh sách dự án TRỒNG RAU HỘ</h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap'
            }}
          >
            {gardens?.map((garden) => (
              <Card
                hoverable
                cover={
                  <img
                    alt="example"
                    src="https://media.istockphoto.com/id/1323663582/vi/anh/tr%E1%BA%BB-em-v%C3%A0-m%E1%BA%B9-l%C3%A0m-v%C6%B0%E1%BB%9Dn-trong-v%C6%B0%E1%BB%9Dn-rau-%E1%BB%9F-s%C3%A2n-sau.jpg?s=612x612&w=0&k=20&c=wU9d5Vwf0Rmb6B7jZOU0T6KgcceeTrGU99lCT2XfH-Q="
                  />
                }
                style={{ width: '23%', marginBottom: '1.5rem', marginRight: '1.5rem' }}
              >
                <Link to={`/manage-planting-garden/${garden._id}`}>
                  <Meta
                    align={'center'}
                    style={{ fontStyle: 'italic' }}
                    title={`Ngày bắt đầu ${formatDateTime(garden.startDate)}`}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <p>Dịch vụ: {garden.template.square} M2</p>
                    <p>Khách hàng: {garden.client.name ? garden.client.name : 'Không có thông tin'}</p>
                    <p>Email: {garden.client.email ? garden.client.email : 'Không có thông tin'}</p>
                    <p>Thông tin liên lạc: {garden.client.phone ? garden.client.phone : 'Không có thông tin'}</p>
                  </div>
                </Link>
                <div>{garden.status === 'started' ? 'Đã bắt đầu' : 'Đã kết thúc'}</div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ManageGarden
