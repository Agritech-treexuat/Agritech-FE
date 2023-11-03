import React, { useState } from 'react';
import FARM from '../../../services/farmService';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import {Image} from 'antd';

const ProjectInput = () => {
  const [initData, setInitData] = useState({})
  const projectID = useParams()
  console.log("params: ", projectID)

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getInit(projectID.id)
      console.log("Data: ", data.data)
      setInitData(data.data.input)
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>Project Input</h2>
      <div>
        <label>Transaction hash: </label>
        <span>{initData.tx}</span>
      </div>
      <div>
        <label>Start Date: </label>
        <span>{initData.initDate}</span>
      </div>
      <div>
        <label>Selected Seed: </label>
        <span>{initData.seed}</span>
      </div>
      <div>
        <label>Amount: </label>
        <span>{initData.amount}</span>
      </div>
      <div>
        <label>Image: </label>
        {initData.images.length == 0 ? initData.images.map((image) => <span>
          <Image
          class={'process-img'}
          src={image}
          onError={(e) => {
            e.target.style.display = 'none'; // Ẩn hình ảnh nếu URL không hợp lệ
          }}
        /></span>) : <span>No image</span>}
      </div>
    </div>
  );
};

export default ProjectInput;
