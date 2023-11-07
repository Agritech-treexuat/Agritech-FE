import React from 'react';
import './style.css'
import { Button, Popover } from 'antd';
import AddProcessPopUp from '../AddProcessPopup';
import UpdateProcessPopup from '../UpdateProcessPopup';
import EditHistory from '../EditHistory';
import {formatDate} from '../../../../../utils/helpers'

const ProcessItem = ({ process, setProcessData }) => {
  const { time, type } = process;
  console.log("Process: ", process, formatDate(process.time))

  return (
    <div style={{marginRight: "15px"}}>
    <div className="process-item">
      <p>Tx: {process.tx}</p>
      <p>Thời gian: {formatDate(time)}</p>
      <p>Loại canh tác: {type}</p>
      {type === 'phân bón' || type === 'BVTV' ? (
        <div>
          <p>Tên: {process.name}</p>
          <p>Lượng: {process.amount}</p>
          <p>Ghi chú: {process.note}</p>
        </div>
      ) : (
        <p>Ghi chú: {process.note}</p>
      )}
    </div>
    <div style={{marginBottom: "30px"}}>
      <UpdateProcessPopup process={process} setProcessData={setProcessData}/>
        <> {process.isEdited ? <EditHistory process={process}/> : <></>}</>
    </div>
    </div>
  );
};

export default ProcessItem;
