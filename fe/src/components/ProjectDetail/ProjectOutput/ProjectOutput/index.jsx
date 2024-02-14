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
  const { outputData, isSuccess, refetch, alllDistributer, isSucessDistributer } = useProjectOutput({
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
  const handleQR = (output) => {
    handleExportQR(params.id, output._id)
  }

  const handleExportQR = async (projectId, outputId) => {
    try {
      await FARM.exportQR(projectId, outputId)
      refetch()
      alert('Eport QR thanh cong')
    } catch (error) {
      console.error(error?.response?.data?.message)
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
      {isSuccess && isSucessDistributer ? (
        <>
          <AddOutputPopup
            refetch={refetch}
            alllDistributer={alllDistributer}
            openNotificationWithIcon={openNotificationWithIcon}
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
                    <Button type="primary" style={{ marginRight: '8px' }}>
                      Xóa
                    </Button>
                  </Popconfirm>
                  <> {output.isEdited ? <EditOutputHistory output={output} /> : <></>}</>
                  <Button type="primary" onClick={() => handleQR(output)} disabled={output.exportQR}>
                    Xuất QR
                  </Button>
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
