import React, { useState } from 'react'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import GARDEN from '../../../services/gardenService'
import { Table } from 'antd'
import Loading from '../../../pages/Loading'
import { formatDateTime } from '../../../utils/helpers'

const GardenProjectExpect = () => {
  const [initData, setInitData] = useState([])
  const gardenId = useParams().id

  useEffect(() => {
    async function fetchData() {
      const data = await GARDEN.getRequestGarden(gardenId)

      data.data.clientRequests
        ? setInitData(
            data.data.clientRequests.map((item) => {
              let detail = ''
              let type = ''

              if (item.type === 'deliveryRequest') {
                detail =
                  item.deliveryDetails.map((detailItem) => `${detailItem.plant}: ${detailItem.amount}kg`).join(', ') +
                  ` (${item.note})`
                type = 'Cây sẽ giao'
              } else if (item.type === 'newPlant') {
                detail = `${item.newPlant} (${item.note})`
                type = 'Trồng cây mới'
              } else if (item.type === 'other') {
                detail = item.note
                type = 'Khác'
              }
              return {
                time: formatDateTime(item.date),
                category: type,
                detail: detail,
                id: item._id
              }
            })
          )
        : setInitData([])
    }
    fetchData()
  }, [])

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      width: 200,
      key: 'time',
      render: (_, record) => <div>{record.time}</div>
    },
    {
      title: 'Loại',
      key: 'type',
      dataIndex: 'type',
      width: 200,
      render: (_, record) => <div>{record.category}</div>
    },
    {
      title: 'Chi tiết',
      dataIndex: 'detail',
      key: 'detail',
      render: (_, record) => <div>{record.detail}</div>
    }
  ]

  return (
    <div>
      {initData ? (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Mong muốn của người dùng</h2>
          <Table bordered={true} columns={columns} dataSource={initData} />{' '}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default GardenProjectExpect
