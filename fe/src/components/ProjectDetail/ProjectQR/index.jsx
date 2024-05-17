import React from 'react'
import useProjectQR from './useProjectQR'
import { useParams } from 'react-router-dom'
import { Collapse, Spin, Table } from 'antd'
import Loading from '../../../pages/Loading'
import { formatDateTime, formatTransactionHashTable } from '../../../utils/helpers'
import { useContractRead } from '@thirdweb-dev/react'
import { useStateContext } from '../../../context'
import { metamaskWallet } from '@thirdweb-dev/react'
import { exportExcel } from '../../../utils/helpers'

const metamaskConfig = metamaskWallet()

const { Panel } = Collapse

const ProjectQR = () => {
  const projectId = useParams().id
  const [loading, setLoading] = React.useState(false)
  const { projectQR, isSuccess, isLoading } = useProjectQR({ projectId })
  const { address, qr_contract, connect } = useStateContext()
  console.log('projectId: ', projectId)
  const {
    data: qrData,
    isSuccess: qrIsSuccess,
    isLoading: qrIsLoading
  } = useContractRead(qr_contract, 'getProductByProjectId', [projectId], {
    from: address
  })
  console.log('qrData: ', qrData)
  console.log('qrIsSuccess: ', qrIsSuccess)
  console.log('qrIsLoading: ', qrIsLoading)
  const columns = [
    {
      title: 'Thời gian quét',
      dataIndex: 'timeScanned',
      key: 'timeScanned',
      render: (text) => formatDateTime(text)
    },
    {
      title: 'Tên nhà phân phối',
      dataIndex: ['distributer', 'name'],
      key: 'distributorName'
    },
    {
      title: 'Tx quét',
      dataIndex: 'txScan',
      key: 'txScan',
      render: (text) =>
        formatTransactionHashTable({
          str: text,
          a: 8,
          b: 5
        })
    }
  ]

  const handleExportExcel = async (exportItem) => {
    console.log('Export excel')
    const filterData = qrData.filter((qr) => {
      return new Date(qr.timeGenerate * 1000).toDateString() === new Date(exportItem?.Thoi_gian).toDateString()
    })

    console.log('filterData: ', filterData)

    const exportExcelData = filterData.map((qr) => {
      return {
        privateQR: JSON.stringify({
          privateId: qr.privateId,
          projectId: projectId
        })
      }
    })

    console.log('exportExcelData: ', exportExcelData)
    await exportExcel(
      exportExcelData,
      `List private QR ${new Date(exportItem?.Thoi_gian).toDateString()}`,
      `ListPrivateQR${new Date(exportItem?.Thoi_gian).toDateString()}`
    )
  }
  return (
    <Spin spinning={loading}>
      <div>
        {isSuccess && (
          <div>
            {projectQR.map((exportItem, index) => (
              <Collapse key={exportItem.Export_lan} style={{ marginBottom: '10px' }}>
                <Panel
                  header={
                    <span style={{ fontSize: '20px' }}>
                      Xuất QR lần {index + 1}: Transaction hash:{' '}
                      <a href={formatTransactionHashTable({ str: exportItem.Export_lan, a: 8, b: 5 })}>
                        {formatTransactionHashTable({ str: exportItem.Export_lan, a: 8, b: 5 })}
                      </a>{' '}
                      - Thời gian: {formatDateTime(exportItem.Thoi_gian)}
                    </span>
                  }
                >
                  {address ? (
                    <>
                      {qrIsSuccess && (
                        <span
                          onClick={() => {
                            handleExportExcel(exportItem)
                          }}
                          style={{ cursor: 'pointer', color: 'blue', fontSize: '16px' }}
                        >
                          Xuất danh sách private QR dưới dạng excel
                        </span>
                      )}
                      {qrIsLoading && <span>Đang tải dữ liệu QR...</span>}
                    </>
                  ) : (
                    <span
                      onClick={async () => {
                        setLoading(true)
                        await connect(metamaskConfig)
                        setLoading(false)
                      }}
                      style={{ cursor: 'pointer', color: 'blue', fontSize: '16px' }}
                    >
                      Kết nối ví Metamask để xuất QR
                    </span>
                  )}
                  {exportItem.Distributer.map((distributer, index) => (
                    <div key={index}>
                      <h2>
                        <strong>Nhà phân phối:</strong> {distributer.distributer.name}
                      </h2>
                      <p>
                        <strong>Tổng số lượng QR:</strong> {distributer.totalQR.length + distributer.scannedQR.length}
                      </p>
                      <p>
                        <strong>Số QR đã quét:</strong> {distributer.scannedQR.length}
                      </p>
                      <Collapse>
                        <Panel header="Chi tiết QR đã quét">
                          <Table dataSource={distributer.scannedQR} columns={columns} rowKey="_id" />
                        </Panel>
                      </Collapse>
                    </div>
                  ))}
                </Panel>
              </Collapse>
            ))}
            {projectQR.length === 0 && <h3>Bạn chưa xuất QR lần nào</h3>}
          </div>
        )}

        {isLoading && <Loading />}
      </div>
    </Spin>
  )
}

export default ProjectQR
