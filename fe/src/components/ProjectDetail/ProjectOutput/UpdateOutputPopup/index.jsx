
import React, { useState } from 'react';
import { Button, Modal} from 'antd';
import UpdateOutputForm from './UpdateOutputForm';

const UpdateOutputPopup = ({output, disabled, setOutputData}) => {
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
      <Button type="primary" onClick={showModal} disabled={disabled}>
        Update Output
      </Button>
      <Modal  title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText='Submit' footer={null}>
        <UpdateOutputForm handleCloseForm={handleOk} output = {output} setOutputData={setOutputData}/>
      </Modal>
    </>
  );
};
export default UpdateOutputPopup;
