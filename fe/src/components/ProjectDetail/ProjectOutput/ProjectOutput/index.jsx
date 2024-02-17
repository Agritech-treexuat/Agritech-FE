import React, { useState } from 'react'
import AddOutputPopup from '../AddOutputPopup'
import FARM from '../../../../services/farmService'
import { useParams } from 'react-router'
import Loading from '../../../../pages/Loading'
import { Space, Table, Button, Image, Modal, notification, Popconfirm } from 'antd'
import { formatDate } from '../../../../utils/helpers'
import EditOutputHistory from '../EditOutputHistory'
import UpdateOutputPopup from '../UpdateOutputPopup'
import useProjectOutput from '../useProjectOutput'
import PROJECT from '../../../../services/projectService'

const { Column } = Table

const ProjectOutput = () => {
  const params = useParams()
  const projectId = useParams().id
  const { outputData, isSuccess, refetch, alllDistributer, isSucessDistributer, projectInfo, isSuccessProjectInfo } =
    useProjectOutput({
      projectId: params.id
    })
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const handleExportQR = async (output) => {
    try {
      console.log('output: ', output)
      const outputId = output.id
      const data = {
        amount: output.amount,
        amountPerOne: output.amountPerOne,
        distributerWithAmount: output.distributerWithAmount.map((item) => {
          return {
            distributer: item.distributer._id,
            amount: item.amount
          }
        })
      }
      const res = await PROJECT.exportQR({ projectId, outputId, data })
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Export QR thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Export QR thất bại')
      }
    } catch (error) {
      console.error(error?.response?.data?.message)
      openNotificationWithIcon('error', 'Thông báo', 'Export QR thất bại')
    }
  }

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

  const handleDeleteOutput = async (outputId) => {
    const res = await PROJECT.deleteOutput({ projectId: params.id, outputId: outputId })
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
      {isSuccess && isSucessDistributer && isSuccessProjectInfo ? (
        <>
          <AddOutputPopup
            refetch={refetch}
            alllDistributer={alllDistributer}
            openNotificationWithIcon={openNotificationWithIcon}
            projectIndex={projectInfo.projectIndex}
          />
          <Table dataSource={outputData}>
            <Column title="Tx" dataIndex="tx" key="tx" />
            <Column title="Thời gian" key="time" render={(_, output) => <p>{formatDate(output.time)}</p>} />
            <Column title="Lượng" dataIndex="amount" key="amount" />
            <Column title="Lượng trên 1 sản phẩm" dataIndex="amountPerOne" key="amountPerOne" />
            <Column
              title="Ảnh"
              key="images"
              render={(_, output) => (
                <>
                  <Button onClick={showModal}>Xem Ảnh</Button>
                  <Modal title="Ảnh" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    {output.images ? (
                      output.images.map((image) => (
                        <span>
                          <Image class={'process-img'} src={image} />
                        </span>
                      ))
                    ) : (
                      <span>Không có ảnh</span>
                    )}
                  </Modal>
                </>
              )}
            />
            <Column
              title="Npp"
              key="npp"
              render={(_, output) => (
                <>
                  {output.distributerWithAmount ? (
                    output.distributerWithAmount.map((npp_item) => (
                      <div>
                        <p>
                          {npp_item.distributer.name} cùng lượng {npp_item.amount}
                        </p>
                      </div>
                    ))
                  ) : (
                    <span>Không có npp</span>
                  )}
                </>
              )}
            />
            <Column
              title="Chỉnh sửa"
              key="action"
              render={(_, output) => (
                <Space size="middle">
                  <UpdateOutputPopup
                    output={output}
                    disabled={output.exportQR}
                    refetch={refetch}
                    alllDistributer={alllDistributer}
                    openNotificationWithIcon={openNotificationWithIcon}
                  />
                  <Popconfirm
                    title="Xóa"
                    description="Bạn có chắc chắn muốn xóa không"
                    onConfirm={handleDeleteOutput.bind(this, output.id)}
                  >
                    <Button type="primary" style={{ marginRight: '8px' }} disabled={output.exportQR}>
                      Xóa
                    </Button>
                  </Popconfirm>
                  <> {output.isEdited ? <EditOutputHistory output={output} /> : <></>}</>
                  <Popconfirm
                    title="Xóa"
                    description="Bạn có chắc chắn muốn export không"
                    onConfirm={handleExportQR.bind(this, output)}
                  >
                    <Button type="primary" disabled={output.exportQR}>
                      Xuất QR
                    </Button>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectOutput
