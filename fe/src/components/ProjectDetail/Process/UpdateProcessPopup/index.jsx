import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import UpdateProcessForm from './UpdateProcessForm';

const UpdateProcessPopup = ({process}) => {
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
        Update Process
      </Button>
      <Modal  title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText='Submit' footer={null}>
        <UpdateProcessForm handleCloseForm={handleOk} process = {process}/>
      </Modal>
    </>
  );
};
export default UpdateProcessPopup;
