import React from 'react'
import useProjectQR from './useProjectQR'
import { useParams } from 'react-router-dom'
import { Collapse, Table } from 'antd'
import Loading from '../../../pages/Loading'

const { Panel } = Collapse

const ProjectQR = () => {
  const projectId = useParams().id
  const { projectQR, isSuccess, isLoading } = useProjectQR({ projectId })
  console.log('projectQR: ', projectQR)
  return (
    <div>
      {isSuccess && (
        <div>
          {projectQR.map((exportItem) => (
            <Collapse key={exportItem.Export_lan}>
              <Panel header={`Export lần: ${exportItem.Export_lan} - Thời gian: ${exportItem.Thoi_gian}`}>
                {exportItem.Distributer.map((distributer, index) => (
                  <div key={index}>
                    <h4>Distributor: {distributer.distributer.name}</h4>
                    <p>Total QR: {distributer.totalQR.length}</p>
                    <p>Scanned QR: {distributer.scannedQR.length}</p>
                    <Collapse>
                      <Panel header="Chi tiết QR đã quét">
                        <Table
                          dataSource={distributer.scannedQR}
                          columns={[
                            { title: 'Thời gian quét', dataIndex: 'timeScanned', key: 'timeScanned' },
                            { title: 'Tên nhà phân phối', dataIndex: ['distributer', 'name'], key: 'distributorName' },
                            { title: 'Tx quét', dataIndex: 'txScan', key: 'txScan' }
                          ]}
                          rowKey="_id"
                        />
                      </Panel>
                    </Collapse>
                  </div>
                ))}
              </Panel>
            </Collapse>
          ))}
        </div>
      )}

      {isLoading && <Loading />}
    </div>
  )
}

export default ProjectQR
