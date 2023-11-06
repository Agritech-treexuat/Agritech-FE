import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import AddProcessForm from './AddProcessForm';

const AddProcessPopUp = ({setProcessData}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);

  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Process
      </Button>
      <Modal  title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText='Submit' footer={null}>
        <AddProcessForm handleCloseForm={handleOk} setProcessData={setProcessData}/>
      </Modal>
    </>
  );
};
export default AddProcessPopUp;
