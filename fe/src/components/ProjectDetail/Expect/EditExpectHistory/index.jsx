import React, { useState } from 'react';
import { Button, Modal } from 'antd';
const EditExpectHistory = ({expect}) => {
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
        Edit history
      </Button>
      <Modal title="Edit history" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        {expect.historyExpect.map((expect) => (
        <div className="expect-item">
          <p>Tx: {expect.tx}</p>
          <p>Date: {expect.time}</p>
          <p>Amount: {expect.amount}</p>
          <p>Note: {expect.note}</p>
          <p>Modified at: {expect.modified_at}</p>
        </div>
      ))}
      </Modal>
    </>
  );
};
export default EditExpectHistory;
