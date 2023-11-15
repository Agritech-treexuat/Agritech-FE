import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import AddProcessForm from './AddProcessForm';
import { useParams } from 'react-router-dom';
import FARM from '../../../../../services/farmService';

const AddProcessPopUp = ({setProcessData}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState([false, false]);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  console.log("modal: ", isModalOpen, isModalOpen2, isModalOpen3, isModalOpen4)
  const [projectTemplate, setProjectTemplate] = useState([])
  const params = useParams()

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getPlanFromProject(params.id)
      if(data.data) {
        console.log("Data here new: ", data.data.plan)
        setProjectTemplate(data.data.plan)
      }
      console.log("prj new: ", projectTemplate)
    }
    fetchData();
    console.log("heree: ", projectTemplate)

  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalOpen2([false, false])
    setIsModalOpen3(false)
    setIsModalOpen4(false)
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2([false, false])
    setIsModalOpen3(false)
    setIsModalOpen4(false)
  };

  // const [isModalOpen2, setIsModalOpen2] = useState(false);
  const toggleModal2 = (idx, target) => {
    setIsModalOpen2((p) => {
      p[idx] = target;
      return [...p];
    });
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  const handleOk2 = () => {
    setIsModalOpen2(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const showModal3 = () => {
    setIsModalOpen3(true);
  };
  const handleOk3 = () => {
    setIsModalOpen3(false);
  };
  const handleCancel3 = () => {
    setIsModalOpen3(false);
  };

  const showModal4 = () => {
    setIsModalOpen4(true);
  };
  const handleOk4 = () => {
    setIsModalOpen4(false);
  };
  const handleCancel4 = () => {
    setIsModalOpen4(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal} style={{marginBottom: "15px"}}>
      Thêm hoạt động
      </Button>
      <Modal  title="Thêm hoạt động " open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText='Submit' footer={null}>
        {
          projectTemplate ? <>
          {projectTemplate.map((item, index) => <>
            <Button type="primary" onClick={() => toggleModal2(index, true)} >
            {item.time + '-' + item.type + '-' +item.cultivativeItems.map((cul_item) => cul_item.name + '-' +cul_item.amount_per_ha)}
            </Button>
            <Modal title="Basic Modal" open={isModalOpen2[index]} onOk={() => toggleModal2(index, false)} onCancel={() => toggleModal2(index, false)}>
              <AddProcessForm handleCloseForm={handleOk} setProcessData={setProcessData} process={item}/>
            </Modal>
          </>)}
          <Button type="primary" onClick={showModal3}>
              None
            </Button>
            <Modal title="Basic Modal" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3}>
              <AddProcessForm handleCloseForm={handleOk} setProcessData={setProcessData}  process={null}/>
            </Modal>
          </> : <>
          <Button type="primary" onClick={showModal4}>
              None
            </Button>
            <Modal title="Basic Modal" open={isModalOpen4} onOk={handleOk4} onCancel={handleCancel4}>
              <AddProcessForm handleCloseForm={handleOk} setProcessData={setProcessData} process={null}/>
            </Modal>
          </>
        }

      </Modal>
    </>
  );
};
export default AddProcessPopUp;
