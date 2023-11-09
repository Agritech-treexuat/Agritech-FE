import React from 'react';
import EditHistory from '../EditHistory';
import UpdateProcessPopup from '../UpdateProcessPopup';
import { Space, Table, Tag } from 'antd';
import Loading from '../../../../../pages/Loading';
import { formatDate } from '../../../../../utils/helpers';

const { Column, ColumnGroup } = Table;

const ProcessList = ({ processes, setProcessData }) => {
  return (
    <div>
      {processes ? (
        <Table dataSource={processes}>
          <Column title="Tx" dataIndex="tx" key="tx" />
          <Column
            title="Thời gian"
            key="time"
            render={(_, process) => (
              <p>{formatDate(process.time)}</p>
            )}
          />
          <Column title="Loại canh tác" dataIndex="type" key="type" />

          <Column
            title="Cụ thể"
            key="cultivativeItems"
            render={(_, process) => (
              <ul>
                {process.cultivativeItems.map((item, index) => (
                  <li key={index}>
                    <strong>{item.name}:</strong> {item.amount_per_ha}
                  </li>
                ))}
              </ul>
            )}
          />

          <Column title="Ghi chú" dataIndex="note" key="note" />

          <Column
            title="Chỉnh sửa"
            key="action"
            render={(_, process) => (
              <Space size="middle">
                <UpdateProcessPopup process={process} setProcessData={setProcessData} />
                {process.isEdited ? <EditHistory process={process} /> : null}
              </Space>
            )}
          />
        </Table>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ProcessList;
