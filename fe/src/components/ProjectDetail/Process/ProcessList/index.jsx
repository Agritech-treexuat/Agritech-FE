import React from 'react';
import ProcessItem from '../ProcessItem';

const ProcessList = ({ processes, setProcessData }) => {
  return (
    <div>
      {processes.map((process, index) => (
        <ProcessItem key={index} process={process} setProcessData={setProcessData}/>
      ))}
    </div>
  );
};

export default ProcessList;
