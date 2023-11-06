import React from 'react';
import './style.css'
import EditExpectHistory from '../EditExpectHistory';
import UpdateExpectPopup from '../UpdateExpectPopup';
import  {formatDate} from '../../../../utils/helpers'

const ExpectItem = ({ expect, setExpectData }) => {
  const { tx, time, amount, note,  } = expect;

  return (
    <>
      <div className="expect-item">
        <p>Tx: {tx}</p>
        <p>Thời gian: {formatDate(time)}</p>
        <p>Lượng: {amount}</p>
        <p>Ghi chú: {note}</p>
      </div>
      <div style={{marginBottom: "30px"}}>
      <UpdateExpectPopup expect={expect} setExpectData={setExpectData}/>
      <> {expect.isEdited ? <EditExpectHistory expect={expect}/> : <></>}</>
      </div>
    </>
  );
};

export default ExpectItem;
