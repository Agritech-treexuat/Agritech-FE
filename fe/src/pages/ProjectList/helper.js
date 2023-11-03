const parseData =  (data) => {
  console.log("after api data: ", data);
  const projects = data.map(item => {
    return {
      id: item?.id,
      title: item?.name,
      seed: item.seed ? item.seed : 'basic',
      startDate: item?.initDate,
      image: item.image ? item.image : 'some_url'
    }
  })

  return {
    projects
  };
};

export default parseData
