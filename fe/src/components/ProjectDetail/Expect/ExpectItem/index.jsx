import React from 'react';
import './style.css'

const ExpectItem = ({ expect }) => {
  const { time, amount, note,  } = expect;

  return (
    <div className="expect-item">
      <p>Date: {time}</p>
      <p>Expect: {amount}</p>
      <p>Note: {note}</p>
    </div>
  );
};

export default ExpectItem;
