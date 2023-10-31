// src/components/CreateProject.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.css'
import { useStateContext } from '../../context';
import CustomButton from '../../components/CustomButton';

const CreateProject = () => {
  const { id } = useParams();
  const [startDate, setStartDate] = useState('');
  const [selectedSeed, setSelectedSeed] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState('');
  const [expected, setExpected] = useState('');
  const { createProject, connect, address } = useStateContext();

  // Mock seed data
  const seeds = ['Seed A', 'Seed B', 'Seed C', 'Seed D'];

  const handleSave = async () => {
    // Handle project creation and data submission here
    console.log("address: ", address)
    console.log("data: ", startDate, selectedSeed, amount, image, expected)
    const input = startDate + " - " + selectedSeed + " - " + amount + " - " + image + " - " + expected;
    await createProject(selectedSeed, input)
  };

  return (
    <div className="create-project-container">
      <h1>Create Project</h1>
      <label htmlFor="start-date">Start Date:</label>
      <input
        type="date"
        id="start-date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label htmlFor="select-seed">Select Seed:</label>
      <select
        id="select-seed"
        value={selectedSeed}
        onChange={(e) => setSelectedSeed(e.target.value)}
      >
        <option value="">Select Seed</option>
        {seeds.map((seed, index) => (
          <option key={index} value={seed}>
            {seed}
          </option>
        ))}
      </select>
      <label htmlFor="amount">Amount:</label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <label htmlFor="image">Image:</label>
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={(e) => setImage(e.target.value)}
      />
      <label htmlFor="expected">Expected:</label>
      <input
        type="text"
        id="expected"
        value={expected}
        onChange={(e) => setExpected(e.target.value)}
      />
      <CustomButton
        btnType="button"
        title={address ? 'Create' : 'Connect'}
        handleClick={() => {
          if(address) handleSave()
          else connect();
        }}
      />
    </div>
  );
};

export default CreateProject;
