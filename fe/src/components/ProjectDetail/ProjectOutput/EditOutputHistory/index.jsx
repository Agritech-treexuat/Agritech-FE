import React, { useState } from 'react';
import { Button, Modal, Upload } from 'antd';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditOutputHistory = ({output}) => {
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
        {output.historyOutput.map((output) => (
        <div className="output-item">
          <p>Date: {output.time}</p>
          <p>Amount: {output.amount}</p>
          <p>Amount per one: {output.amount_perOne}</p>
          <Upload
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture-card"
            fileList={output.images}
            onPreview={handlePreview}
          >
          </Upload>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelImage}>
            <img
              alt="example"
              style={{
                width: '100%',
              }}
              src={previewImage}
            />
          </Modal>
        </div>
      ))}
      </Modal>
    </>
  );
};
export default EditOutputHistory;
