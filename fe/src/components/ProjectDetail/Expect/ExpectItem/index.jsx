import React from 'react';
import './style.css'
import EditExpectHistory from '../EditExpectHistory';
import UpdateExpectPopup from '../UpdateExpectPopup';

const ExpectItem = ({ expect, setExpectData }) => {
  const { tx, time, amount, note,  } = expect;

  return (
    <>
      <div className="expect-item">
        <p>Tx: {tx}</p>
        <p>Date: {time}</p>
        <p>Expect: {amount}</p>
        <p>Note: {note}</p>
      </div>
      <UpdateExpectPopup expect={expect} setExpectData={setExpectData}/>
      <> {expect.isEdited ? <EditExpectHistory expect={expect}/> : <></>}</>
    </>
  );
};

export default ExpectItem;
