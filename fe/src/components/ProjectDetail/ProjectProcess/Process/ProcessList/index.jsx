import React from 'react';
import ProcessItem from '../ProcessItem';
import EditHistory from '../EditHistory';
import UpdateProcessPopup from '../UpdateProcessPopup';
import { Space, Table, Tag } from 'antd';
import Loading from '../../../../../pages/Loading';
import { formatDate } from '../../../../../utils/helpers';

const { Column, ColumnGroup } = Table;

const ProcessList = ({ processes, setProcessData }) => {
  return (
    <div>
      {processes? (
        <Table dataSource={processes}>
          <Column title="Tx" dataIndex="tx" key="tx" />
          <Column
            title="Thời gian"
            key="time"
            render={(_, processes) =>
              <p>
                {formatDate(processes.time)}
              </p>
            }
          />
          <Column title="Loại canh tác" dataIndex="type" key="type" />
          <Column title="Tên" dataIndex="name" key="name" />
          <Column title="Lượng" dataIndex="amount" key="amount" />
          <Column title="Ghi chú" dataIndex="note" key="note" />

          <Column
            title="Chỉnh sửa"
            key="action"
            render={(_, process) => (
              <Space size="middle">
                <UpdateProcessPopup process={process} setProcessData={setProcessData}/>
                <> {process.isEdited ? <EditHistory process={process}/> : <></>}</>
              </Space>
            )}
          />
        </Table>
        ) : <Loading />}
    </div>
  );
};

export default ProcessList;
