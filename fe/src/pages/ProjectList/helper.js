const parseData = (data) => {
  console.log('after api data: ', data)
  const allProjects = data.map((item) => {
    return {
      id: item?.id,
      title: item?.name,
      seed: item.seed ? item.seed : 'basic',
      startDate: item?.initDate,
      image: item.image ? item.image : 'some_url',
      status: item.status ? item.status : 'started',
      isGarden: item.isGarden ? item.isGarden : false
    }
  })

  const projects = allProjects.filter((project) => project.isGarden === false)

  return {
    projects
  }
}

export default parseData
