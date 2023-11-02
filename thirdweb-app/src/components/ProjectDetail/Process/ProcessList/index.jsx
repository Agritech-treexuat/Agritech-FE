import React from 'react';
import ProcessItem from '../ProcessItem';

const ProcessList = ({ processes }) => {
  return (
    <div>
      {processes.map((process, index) => (
        <ProcessItem key={index} process={process} />
      ))}
    </div>
  );
};

export default ProcessList;
