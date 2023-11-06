import React, { useState } from 'react';
import { Button, Modal, Upload, Image } from 'antd';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditInputHistory = ({input}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancelImage = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit history
      </Button>
      <Modal title="Edit history" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        {input.historyInput.map((input) => (
        <div className="input-item">
          <div>
            <label>Transaction hash: </label>
            <span>{input.tx}</span>
          </div>
          <div>
            <label>Start Date: </label>
            <span>{input.initDate}</span>
          </div>
          <div>
            <label>Selected Seed: </label>
            <span>{input.seed}</span>
          </div>
          <div>
            <label>Amount: </label>
            <span>{input.amount}</span>
          </div>
          <div>
            <label>Image: </label>
            {input.images.length > 0 ? input.images.map((image) => <span>
              <Image
              class={'process-img'}
              src={image}
            /></span>) : <span>No image</span>}
          </div>
          <div>
            <label>Modified at: </label>
            <span>{input.modified_at}</span>
          </div>
        </div>
      ))}
      </Modal>
    </>
  );
};
export default EditInputHistory;
