import React from 'react'
import Loading from '../../../pages/Loading'
import { useParams } from 'react-router'
import { Space, Table } from 'antd'
import UpdateExpectPopup from './UpdateExpectPopup'
import EditExpectHistory from './EditExpectHistory'
import AddExpectPopup from './AddExpectPopup'
import { formatDate } from '../../../utils/helpers'
import useProjectExpect from './useProjectExpect'

const { Column } = Table

const ProjectExpect = () => {
  const projectId = useParams().id
  const { expectData, isSuccess, refetch } = useProjectExpect({ projectId })
  console.log('expectData: ', expectData)
  return (
    <div>
      <AddExpectPopup refetch={refetch} />
      {isSuccess ? (
        <Table dataSource={expectData}>
          <Column title="Transaction hash" dataIndex="tx" key="tx" />
          <Column title="Thời gian" key="time" render={(_, expect) => <p>{formatDate(expect.time)}</p>} />
          <Column title="Lượng" dataIndex="amount" key="amount" />
          <Column title="Ghi chú" dataIndex="note" key="note" />

          <Column
            title="Chỉnh sửa"
            key="action"
            render={(_, expect) => (
              <Space size="middle">
                <UpdateExpectPopup expect={expect} refetch={refetch} />
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
