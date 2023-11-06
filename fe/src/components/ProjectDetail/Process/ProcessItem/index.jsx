import React from 'react';
import './style.css'
import { Button, Popover } from 'antd';
import AddProcessPopUp from '../AddProcessPopup';
import UpdateProcessPopup from '../UpdateProcessPopup';
import EditHistory from '../EditHistory';

const ProcessItem = ({ process, setProcessData }) => {
  const { time, type } = process;
  console.log("Process: ", process)

  const content = (process) => {
    return (
      process.historyProcess.map((process) => (
        <div className="process-item">
          <p>Tx: {process.tx}</p>
          <p>Date: {process.time}</p>
          <p>Type: {process.type}</p>
          {process.type === 'phân bón' || process.type === 'BVTV' ? (
            <div>
              <p>Name: {process.name}</p>
              <p>Amount: {process.amount}</p>
              <p>Note: {process.note}</p>
            </div>
          ) : (
            <p>Note: {process.note}</p>
          )}
          <p>Modified at: {process.modified_at}</p>
        </div>
      ))
  )};

  return (
    <div className="process-item">
      <p>Tx: {process.tx}</p>
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
      <UpdateProcessPopup process={process} setProcessData={setProcessData}/>
      <> {process.isEdited ? <EditHistory process={process}/> : <></>}</>
    </div>
  );
};

export default ProcessItem;
