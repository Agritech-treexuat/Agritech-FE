import React from 'react'
import useProjectQR from './useProjectQR'
import { useParams } from 'react-router-dom'
import { Collapse, Table } from 'antd'
import Loading from '../../../pages/Loading'
import { formatDateTime, formatTransactionHashTable } from '../../../utils/helpers'

const { Panel } = Collapse

const ProjectQR = () => {
  const projectId = useParams().id
  const { projectQR, isSuccess, isLoading } = useProjectQR({ projectId })
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
  return (
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
                {exportItem.Distributer.map((distributer, index) => (
                  <div key={index}>
                    <h2>
                      <strong>Nhà phân phối:</strong> {distributer.distributer.name}
                    </h2>
                    <p>
                      <strong>Tổng số lượng QR:</strong> {distributer.totalQR.length}
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
  )
}

export default ProjectQR
