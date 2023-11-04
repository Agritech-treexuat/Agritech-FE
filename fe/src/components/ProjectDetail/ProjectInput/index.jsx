import React, { useState } from 'react';
import FARM from '../../../services/farmService';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import {Image} from 'antd';
import Loading from '../../../pages/Loading';
import UpdateInputPopup from './UpdateInputPopup';
import EditInputHistory from './EditInputHistory';

const ProjectInput = () => {
  const [initData, setInitData] = useState(null)
  const projectID = useParams()
  console.log("params: ", projectID)

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getInit(projectID.id)
      console.log("Data: ", data.data)
      setInitData(data.data.input)
    }
    fetchData();
    console.log("Init data: ", initData)
  }, []);

  return (
    <div>
      {initData ?
      (<div>
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
          {initData.images.length > 0 ? initData.images.map((image) => <span>
            <Image
            class={'process-img'}
            src={image}
          /></span>) : <span>No image</span>}
          <UpdateInputPopup input={initData}/>
      <> {initData.isEdited ? <EditInputHistory input={initData}/> : <></>}</>
        </div>
      </div>) : <Loading />
      }
    </div>
  );
};

export default ProjectInput;
