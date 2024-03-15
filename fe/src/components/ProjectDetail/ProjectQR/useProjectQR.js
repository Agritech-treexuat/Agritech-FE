import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../../services/projectService'
import QR from '../../../services/qrService'

export default function useProjectQR({ projectId }) {
  const parseData = useCallback((data) => {
    console.log('data: ', data)
    const output = []

    // Tạo một đối tượng Map để theo dõi các bản ghi theo txExport
    const txExportMap = new Map()

    // Lặp qua mỗi bản ghi trong dữ liệu đầu vào
    data.forEach((record) => {
      const { txExport, time, distributer, isScanned } = record

      // Nếu khóa chưa tồn tại trong Map, thêm nó vào với một mảng trống
      if (!txExportMap.has(txExport)) {
        txExportMap.set(txExport, [])
      }

      // Lấy danh sách các bản ghi của khóa txExport từ Map
      const records = txExportMap.get(txExport)

      // Tạo một đối tượng Distributer mới nếu chưa có
      let distributerEntry = records.find((entry) => entry.distributer._id === distributer._id)
      if (!distributerEntry) {
        distributerEntry = { distributer, time, scannedQR: [], totalQR: [] }
        records.push(distributerEntry)
      }

      // Dựa vào trạng thái của QR, đẩy nó vào mảng tương ứng
      if (isScanned) {
        distributerEntry.scannedQR.push(record)
      } else {
        distributerEntry.totalQR.push(record)
      }
    })

    // Lặp qua mỗi cặp khóa/giá trị trong Map và tạo đối tượng Export
    for (const [txExport, records] of txExportMap.entries()) {
      const { time } = records[0]
      output.push({
        Export_lan: txExport,
        Thoi_gian: time,
        Distributer: records
      })
    }

    return { output }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getQRByProject', projectId],
    queryFn: () => QR.getQRByProject(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!projectId
  })

  return {
    projectQR: data?.output,
    isSuccess,
    isLoading,
    refetch
  }
}
