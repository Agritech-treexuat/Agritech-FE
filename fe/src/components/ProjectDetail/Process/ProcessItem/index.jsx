import React from 'react';
import './style.css'

const ProcessItem = ({ process }) => {
  const { time, type } = process;

  return (
    <div className="process-item">
      <p>Date: {time}</p>
      <p>Type: {type}</p>
      {type === 'phân bón' || type === 'BVTV' ? (
        <div>
          <p>Name: {process.name}</p>
          <p>Amount: {process.amount}</p>
          <p>Note: {process.note}</p>
        </div>
      ) : (
        <p>Note: {process.note}</p>
      )}
    </div>
  );
};

export default ProcessItem;
