import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import FARM from '../../services/farmService';

export default function useProjectList() {
  const farmId = localStorage.getItem('id')
  console.log("farm id: ", farmId)

  const parseData =  useCallback((data) => {
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
  }, []);

  // const handleFetch = async (farmId) => {
  //   const data = await FARM.getProjects(farmId)
  //   console.log("dtaa: ", data)
  //   const data2 = parseData(data.data)
  //   console.log("2: ", data2)

  //   return data2
  // }


  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['projects', farmId],
    queryFn: () => FARM.getProjects(farmId),
    select: (data) => parseData(data.data)
  });

  return {
    data, isSuccess, isLoading
  };
}
