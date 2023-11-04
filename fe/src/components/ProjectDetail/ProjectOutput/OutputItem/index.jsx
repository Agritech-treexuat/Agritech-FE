import React, { useState } from 'react';
import './style.css'
import { Modal, Upload } from 'antd';
import UpdateOutputPopup from '../UpdateOutputPopup';
import EditOutputHistory from '../EditOutputHistory';
import {Image} from 'antd';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const OutputItem = ({ output }) => {
  const { time, amount, amount_perOne, images } = output;
  console.log("images: ", images)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState(images)
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    console.log("file list: ", fileList)
  };

  return (
    <div className="output-item">
      <p>Date: {time}</p>
      <p>Amount: {amount}</p>
      <p>Amount per one: {amount_perOne}</p>
      {/* <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture-card"
        fileList={images}
        onPreview={handlePreview}
        onChange={handleChange}
      >
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal> */}
      {
        images ? images.map((image) => <span>
          <Image
          class={'process-img'}
          src={image}
        /></span>) : <span>No image</span>
      }
      <UpdateOutputPopup output={output}/>
      <> {output.isEdited ? <EditOutputHistory output={output}/> : <></>}</>
    </div>
  );
};

export default OutputItem;
