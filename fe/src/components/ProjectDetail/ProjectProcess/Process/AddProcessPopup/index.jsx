import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import AddProcessForm from './AddProcessForm'
import { useParams } from 'react-router-dom'
import FARM from '../../../../../services/farmService'

const AddProcessPopUp = ({ setProcessData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpen2, setIsModalOpen2] = useState([false, false])
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const [projectTemplate, setProjectTemplate] = useState([])
  const params = useParams()

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getPlanFromProject(params.id)
      if (data.data) {
        setProjectTemplate(data.data.plan)
      }
    }
    fetchData()
  }, [])

  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen2([false, false])
    setIsModalOpen3(false)
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen2([false, false])
    setIsModalOpen3(false)
    setIsModalOpen(false)
  }

  const toggleModal2 = (idx, target) => {
    setIsModalOpen2((p) => {
      p[idx] = target
      return [...p]
    })
  }

  const showModal3 = () => {
    setIsModalOpen3(true)
  }
  const handleOk3 = () => {
    setIsModalOpen3(false)
  }
  const handleCancel3 = () => {
    setIsModalOpen3(false)
  }

  const modalContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }

  const buttonContainerStyle = {
    margin: '8px 0'
  }

  return (
    <>
      <Button type="primary" onClick={showModal} style={{ marginBottom: '15px' }}>
        Thêm hoạt động
      </Button>
      <Modal
        title="Thêm hoạt động"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        footer={null}
      >
        <div style={modalContentStyle}>
          {projectTemplate ? (
            projectTemplate.map((item, index) => (
              <div key={index} style={buttonContainerStyle}>
                <Button type="primary" onClick={() => toggleModal2(index, true)}>
                  {`${item.time} (${item.type}) ${item.agroChemicalItems.map(
                    (cul_item) => `${cul_item.name}-${cul_item.amountPerHa}`
                  )} ${item.note}`}
                </Button>
              </div>
            ))
          ) : (
            <></>
          )}
          <div style={buttonContainerStyle}>
            <Button type="primary" onClick={showModal3}>
              Trống
            </Button>
          </div>
        </div>
      </Modal>
      {projectTemplate.map((item, index) => (
        <>
          <Modal
            title="Thêm hoạt động"
            open={isModalOpen2[index]}
            onOk={() => toggleModal2(index, false)}
            onCancel={() => toggleModal2(index, false)}
            footer={null}
          >
            <AddProcessForm handleCloseForm={handleOk} setProcessData={setProcessData} process={item} />
          </Modal>
        </>
      ))}
      <Modal title="Thêm hoạt động" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3} footer={null}>
        <AddProcessForm handleCloseForm={handleOk} setProcessData={setProcessData} process={null} />
      </Modal>
    </>
  )
}
export default AddProcessPopUp
