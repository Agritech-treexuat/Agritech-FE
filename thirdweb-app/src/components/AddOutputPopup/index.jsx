import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import AddOutputForm from './AddOutputForm';

const AddOutputPopup = () => {
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
        Add output
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <AddOutputForm handleCloseForm={handleOk}/>
      </Modal>
    </>
  );
};
export default AddOutputPopup;
