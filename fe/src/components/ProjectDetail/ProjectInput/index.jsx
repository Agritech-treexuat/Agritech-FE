import React from 'react';

const ProjectInput = ({
  startDate,
  selectedSeed,
  amount,
  image,
  expected,
}) => {
  return (
    <div>
      <h2>Project Input</h2>
      <div>
        <label>Start Date: </label>
        <span>{startDate}</span>
      </div>
      <div>
        <label>Selected Seed: </label>
        <span>{selectedSeed}</span>
      </div>
      <div>
        <label>Amount: </label>
        <span>{amount}</span>
      </div>
      <div>
        <label>Image: </label>
        {image && <img src={image} alt="Project" />}
      </div>
      <div>
        <label>Expected: </label>
        <span>{expected}</span>
      </div>
    </div>
  );
};

export default ProjectInput;
