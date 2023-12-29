import React from 'react'
import { Tabs } from 'antd'
import GardenProjectInput from '../../components/GardenProjectDetail/GardenProjectInput'
import GardenProjectOrder from '../../components/GardenProjectDetail/GardenProjectOrder'
import GardenProjectProcess from '../../components/GardenProjectDetail/GardenProjectProcess'
import GardenProjectTemplate from '../../components/GardenProjectDetail/GardenProjectTemplate'
import GardenProjectExpect from '../../components/GardenProjectDetail/GardenProjectExpect'
import GardenProjectOutput from '../../components/GardenProjectDetail/GardenProjectOutput'

const onChange = (key) => {
  console.log(key)
}

const GardenProjectDetail = () => {
  const items = [
    {
      key: '1',
      label: 'Thông tin đơn hàng',
      children: <GardenProjectOrder />
    },
    {
      key: '2',
      label: 'Đầu vào',
      children: <GardenProjectInput />
    },
    {
      key: '3',
      label: 'Quy trình canh tác',
      children: <GardenProjectTemplate />
    },
    {
      key: '4',
      label: 'Quá trình canh tác',
      children: <GardenProjectProcess />
    },
    {
      key: '5',
      label: 'Mong muốn người dùng',
      children: <GardenProjectExpect />
    },
    {
      key: '6',
      label: 'Đầu ra',
      children: <GardenProjectOutput />
    }
  ]
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}
export default GardenProjectDetail
