import React from 'react'
import { useParams } from 'react-router'
import { Divider, Alert } from 'antd'
import Loading from '../../../pages/Loading'
import { CalendarFilled } from '@ant-design/icons'
import { formatDateTime } from '../../../utils/helpers'
import useGardenProjectOrder from './useGardenProjectOrder'

const GardenProjectOrder = () => {
  const gardenId = useParams().id
  const { initData, isSuccess } = useGardenProjectOrder(gardenId)

  return (
    <div>
      {isSuccess ? (
        <div>
          <div>
            <Alert
              style={{ fontWeight: '500', fontSize: '16px' }}
              message={`Ngày đặt hàng ${formatDateTime(initData.startDate)}`}
              showIcon
              icon={<CalendarFilled />}
              type="success"
            />
            <Divider orientationMargin={0} orientation="left">
              <h3>Thông tin khách hàng</h3>
            </Divider>
            <div>
              <p>
                <strong>Tên:</strong> {initData.client?.name ? initData.client.name : 'Không có thông tin'}
              </p>
              <p>
                <strong>SĐT:</strong> {initData.client?.phone ? initData.client.phone : 'Không có thông tin'}
              </p>
              <p>
                <strong>Email:</strong> {initData.client?.email ? initData.client.email : 'Không có thông tin'}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {initData.client?.address ? initData.client.address : 'Không có thông tin'}
              </p>
            </div>

            <Divider orientationMargin={0} orientation="left">
              <h3>Yêu cầu</h3>
            </Divider>

            <p>
              <i>
                <strong>Dịch vụ</strong>:
                <span>Diện tích: {initData.template?.square ? initData.template.square : 'Không có thông tin'} M2</span>
              </i>
            </p>
            <p>
              <strong>Giá: </strong>
              {initData.template?.price
                ? initData.template?.price.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  })
                : 'Không có thông tin'}
            </p>
            <div style={{ textAlign: 'right', width: '50%' }}>
              <div className="styleText">
                <p style={{ fontWeight: '600' }}>CHỦNG LOẠI GIEO TRỒNG</p>
              </div>
              <p>{initData.template.herbMax} Rau gia vị</p>
              {initData.herbList.map((herb) => (
                <p>{herb.name}</p>
              ))}
              <p>{initData.template.leafyMax} Rau ăn lá</p>
              {initData.leafyList.map((leafy) => (
                <p>{leafy.name}</p>
              ))}
              <p>{initData.template.rootMax} Củ</p>
              {initData.rootList.map((root) => (
                <p>{root.name}</p>
              ))}
              <p>{initData.template.fruitMax} Quả</p>
              {initData.fruitList.map((fruit) => (
                <p>{fruit.name}</p>
              ))}
              <div className="styleText">
                <p style={{ fontWeight: '600' }}>SẢN LƯỢNG DỰ KIẾN</p>
                <p>{initData.template.expectedOutput} kg/tháng</p>
              </div>
              <div className="styleText">
                <p style={{ fontWeight: '600' }}>SỐ LẦN GỬI RAU TỚI NHÀ</p>
                <p>{initData.template.expectDeliveryPerWeek} lần/ tuần</p>
              </div>
              <div className="styleText">
                <p style={{ fontWeight: '600' }}>SỐ LƯỢNG GỬI RAU TỚI NHÀ / lần</p>
                <p>{initData.template.expectDeliveryAmount} kg/ lần</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default GardenProjectOrder
