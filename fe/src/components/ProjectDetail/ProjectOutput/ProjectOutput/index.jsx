import React, { useState } from 'react';
import OutputItem from '../OutputItem'; // Import ProcessItem component
import AddOutputPopup from '../AddOutputPopup';
import FARM from '../../../../services/farmService';
import { useParams } from 'react-router';
import Loading from '../../../../pages/Loading';
import { useEffect } from 'react';


const ProjectOutput = () => {
  const [outputData, setOutputData] = useState([])
  const params = useParams()

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getOutput(params.id)
      console.log("Data: ", data.data)
      setOutputData(data.data.outputs)
    }
    fetchData();
    console.log("Output data: ", outputData)
  }, []);

  return (
    <div>
      {
        outputData ? <>
        {
          outputData.map((output, index) => (
            <OutputItem key={index} output={output} setOutputData={setOutputData}/>
          ))
        }
        <AddOutputPopup setOutputData={setOutputData}/>
        </> : <Loading />
        }
    </div>
  );
};

export default ProjectOutput;
