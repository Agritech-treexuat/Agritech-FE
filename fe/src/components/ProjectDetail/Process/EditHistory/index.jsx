import React, { useState } from 'react';
import { Button, Modal } from 'antd';
const EditHistory = ({process}) => {
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
        {process.historyProcess.map((process) => (
        <div className="process-item">
          <p>Tx: {process.tx}</p>
          <p>Date: {process.time}</p>
          <p>Type: {process.type}</p>
          {process.type === 'phân bón' || process.type === 'BVTV' ? (
            <div>
              <p>Name: {process.name}</p>
              <p>Amount: {process.amount}</p>
              <p>Note: {process.note}</p>
            </div>
          ) : (
            <p>Note: {process.note}</p>
          )}
          <p>Modified at: {process.modified_at}</p>
        </div>
      ))}
      </Modal>
    </>
  );
};
export default EditHistory;
