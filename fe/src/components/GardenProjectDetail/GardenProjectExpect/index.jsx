import React, { useState } from 'react'
import FARM from '../../../services/farmService'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import GARDEN from '../../../services/gardenService'

import {
  Col,
  Row,
  Image,
  Card,
  Button,
  Table,
  Column,
  ColumnGroup,
  Form,
  Input,
  Modal,
  Divider,
  Flex,
  Select
} from 'antd'
import { HistoryOutlined, EditFilled } from '@ant-design/icons'

import Loading from '../../../pages/Loading'
import MenuDivider from 'antd/es/menu/MenuDivider'

const { Meta } = Card

const GardenProjectExpect = () => {
  const [initData, setInitData] = useState([])
  const projectID = useParams()
  console.log('params: ', projectID)
  const gardenId = useParams().id
  console.log('params: ', projectID)

  useEffect(() => {
    setInitData([
      {
        time: new Date().toISOString(),
        category: 'Trồng cây mới',
        detail: 'abcxyz'
      },
      {
        time: new Date().toISOString(),
        category: 'Trồng cây mới',
        detail: 'abcxyz'
      },
      {
        time: new Date().toISOString(),
        category: 'Trồng cây mới',
        detail: 'abcxyz'
      },
      {
        time: new Date().toISOString(),
        category: 'Trồng cây mới',
        detail: 'abcxyz'
      },
      {
        time: new Date().toISOString(),
        category: 'Trồng cây mới',
        detail: 'abcxyz'
      },
      {
        time: new Date().toISOString(),
        category: 'Trồng cây mới',
        detail: 'abcxyz'
      }
    ])
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await GARDEN.getRequestGarden(gardenId)

      data.data.clientRequests
        ? setInitData(
            data.data.clientRequests.map((item) => {
              return {
                time: item.date,
                category: item.type,
                detail: item.note,
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
