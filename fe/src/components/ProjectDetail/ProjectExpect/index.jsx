import React from 'react'
import { useState, useEffect } from 'react'
import FARM from '../../../services/farmService'
import Loading from '../../../pages/Loading'
import { useParams } from 'react-router'
import { Space, Table, Tag } from 'antd'
import UpdateExpectPopup from './UpdateExpectPopup'
import EditExpectHistory from './EditExpectHistory'
import AddExpectPopup from './AddExpectPopup'
import { formatDate } from '../../../utils/helpers'

const { Column, ColumnGroup } = Table

const ProjectExpect = () => {
  const [expectData, setExpectData] = useState([])
  const projectID = useParams()

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getExpect(projectID.id)
      console.log('Data: ', data.data)
      setExpectData(data.data.expects)
    }
    fetchData()
    console.log('Expect data: ', expectData)
  }, [])
  return (
    <div>
      <AddExpectPopup setExpectData={setExpectData} />
      {expectData ? (
        <Table dataSource={expectData}>
          <Column title="Tx" dataIndex="tx" key="tx" />
          <Column title="Thời gian" key="time" render={(_, expect) => <p>{formatDate(expect.time)}</p>} />
          <Column title="Lượng" dataIndex="amount" key="amount" />
          <Column title="Ghi chú" dataIndex="note" key="note" />

          <Column
            title="Chỉnh sửa"
            key="action"
            render={(_, expect) => (
              <Space size="middle">
                <UpdateExpectPopup expect={expect} setExpectData={setExpectData} />
                <> {expect.isEdited ? <EditExpectHistory expect={expect} /> : <></>}</>
              </Space>
            )}
          />
        </Table>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectExpect
