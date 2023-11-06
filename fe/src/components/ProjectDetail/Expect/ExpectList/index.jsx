import React from 'react';
import ExpectItem from '../ExpectItem'; // Import ExpectItem component

const ExpectList = ({ expects, setExpectData }) => {
  return (
    <div>
      {expects.map((expect, index) => (
        <ExpectItem key={index} expect={expect} setExpectData={setExpectData}/>
      ))}
    </div>
  );
};

export default ExpectList;
