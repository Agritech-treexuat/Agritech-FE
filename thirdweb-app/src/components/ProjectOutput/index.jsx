import React from 'react';
import OutputItem from '../OutputItem'; // Import ProcessItem component
import AddOutputPopup from '../AddOutputPopup';

const ProjectOutput = () => {
  const outputs = [
    {
      "tx": "aancbcb",
      "amount": 1000000000000000,
      "amount_perOne": "10",
      "images": [{
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-3',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
      "date": "2024-05-04"
    },
    {
      "tx": "hhhhbcb",
      "amount": 99900000000,
      "amount_perOne": "100",
      "images": [{
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-3',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
      "date": "2024-05-04"
  }
  ]
  return (
    <div>
      {outputs.map((output, index) => (
        <OutputItem key={index} output={output} />
      ))}
      <AddOutputPopup />
    </div>
  );
};

export default ProjectOutput;
