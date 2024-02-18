import React from 'react'
import Loading from '../../../pages/Loading'
import { useParams } from 'react-router'
import { Button, Popconfirm, Space, Table, notification } from 'antd'
import UpdateExpectPopup from './UpdateExpectPopup'
import EditExpectHistory from './EditExpectHistory'
import AddExpectPopup from './AddExpectPopup'
import { formatDate } from '../../../utils/helpers'
import useProjectExpect from './useProjectExpect'
import PROJECT from '../../../services/projectService'

const { Column } = Table

const ProjectExpect = () => {
  const projectId = useParams().id
  const { expectData, isSuccess, refetch, projectInfo, isSuccessProjectInfo } = useProjectExpect({ projectId })
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const handleDeleteExpect = async (expectId) => {
    const res = await PROJECT.deleteExpect({ projectId, expectId: expectId })
    if (res.status === 200) {
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công')
    } else {
      openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
    }
  }

  return (
    <div>
      {contextHolder}
      <AddExpectPopup
        refetch={refetch}
        openNotificationWithIcon={openNotificationWithIcon}
        projectIndex={projectInfo.projectIndex}
      />
      {isSuccess && isSuccessProjectInfo ? (
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
                <UpdateExpectPopup
                  expect={expect}
                  refetch={refetch}
                  openNotificationWithIcon={openNotificationWithIcon}
                />
                <Popconfirm
                  title="Xóa"
                  description="Bạn có chắc chắn muốn xóa không"
                  onConfirm={handleDeleteExpect.bind(this, expect.id)}
                >
                  <Button type="primary" style={{ marginRight: '8px' }}>
                    Xóa
                  </Button>
                </Popconfirm>
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
