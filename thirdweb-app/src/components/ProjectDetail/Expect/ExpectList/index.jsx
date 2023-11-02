import React from 'react';
import ExpectItem from '../ExpectItem'; // Import ExpectItem component

const ExpectList = ({ expects }) => {
  return (
    <div>
      {expects.map((expect, index) => (
        <ExpectItem key={index} expect={expect} />
      ))}
    </div>
  );
};

export default ExpectList;
