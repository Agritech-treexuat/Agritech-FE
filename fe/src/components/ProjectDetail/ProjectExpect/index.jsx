import React from 'react';
import ExpectItem from './ExpectItem';
import { useState, useEffect } from 'react';
import FARM from '../../../services/farmService';
import Loading from '../../../pages/Loading';
import { useParams } from 'react-router';

const ProjectExpect = () => {
  const [expectData, setExpectData] = useState([])
  const projectID = useParams()

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getExpect(projectID.id)
      console.log("Data: ", data.data)
      setExpectData(data.data.expects)
    }
    fetchData();
    console.log("Expect data: ", expectData)
  }, []);
  return (
    <div>
      {expectData? expectData.map((expect, index) => (
        <ExpectItem key={index} expect={expect} setExpectData={setExpectData}/>
      )) : <Loading />}
    </div>
  );
};

export default ProjectExpect;
