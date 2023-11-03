import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import AddExpectForm from './AddExpectForm';

const AddExpectPopup = () => {
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
        Add expect
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <AddExpectForm handleCloseForm={handleOk}/>
      </Modal>
    </>
  );
};
export default AddExpectPopup;
