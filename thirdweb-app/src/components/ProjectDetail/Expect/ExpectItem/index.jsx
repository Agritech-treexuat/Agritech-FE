import React from 'react';
import './style.css'

const ExpectItem = ({ expect }) => {
  const { date, amount, note,  } = expect;

  return (
    <div className="expect-item">
      <p>Date: {date}</p>
      <p>Expect: {amount}</p>
      <p>Note: {note}</p>
    </div>
  );
};

export default ExpectItem;
