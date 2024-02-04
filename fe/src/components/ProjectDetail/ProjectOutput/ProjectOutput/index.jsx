import React, { useState } from 'react'
import AddOutputPopup from '../AddOutputPopup'
import FARM from '../../../../services/farmService'
import { useParams } from 'react-router'
import Loading from '../../../../pages/Loading'
import { Space, Table, Button, Image, Modal } from 'antd'
import { formatDate } from '../../../../utils/helpers'
import EditOutputHistory from '../EditOutputHistory'
import UpdateOutputPopup from '../UpdateOutputPopup'
import useProjectOutput from '../useProjectOutput'

const { Column } = Table

const ProjectOutput = () => {
  const params = useParams()
  const { outputData, isSuccess, refetch, alllDistributer, isSucessDistributer } = useProjectOutput({
    projectId: params.id
  })
  console.log('outputdata: ', outputData)
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

  return (
    <div>
      {isSuccess && isSucessDistributer ? (
        <>
          <AddOutputPopup refetch={refetch} alllDistributer={alllDistributer} />
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
                  />
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
