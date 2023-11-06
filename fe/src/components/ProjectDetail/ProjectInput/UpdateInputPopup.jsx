import React, { useState } from 'react';
import { Button, Modal} from 'antd';
import UpdateInputForm from './UpdateInputForm';

const UpdateInputPopup = ({input, setInitData}) => {
  console.log("input pop up: ", input)
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
      <Button style={{marginRight: "6px"}} type="primary" onClick={showModal}>
        Update Input
      </Button>
      <Modal  title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText='Submit' footer={null}>
        <UpdateInputForm handleCloseForm={handleOk} input = {input} setInitData={setInitData}/>
      </Modal>
    </>
  );
};
export default UpdateInputPopup;
