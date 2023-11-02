import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import AddProcessForm from './AddProcessForm';

const AddProcessPopUp = () => {
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
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <AddProcessForm handleCloseForm={handleOk}/>
      </Modal>
    </>
  );
};
export default AddProcessPopUp;
