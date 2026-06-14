/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TablePaginationConfig, TableProps } from "antd";
import { Empty, Table } from "antd";
import { FilterValue } from "antd/es/table/interface";

interface Props<T> extends Omit<TableProps<T>, "dataSource" | "pagination"> {
  columns: TableProps<T>["columns"];
  data: T[];
  total?: number;
  pagination?: any;
  query?: Record<string, unknown>;
  setQuery?: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}

const CustomTable = <T extends object>({ columns, data, total, query, setQuery = () => {}, ...props }: Props<T>) => {
  const changeHandler = (pagination: TablePaginationConfig, filter: Record<string, FilterValue | null>) => {
    const { current, pageSize } = pagination;
    const cleanedFilter: Record<string, any> = {};

    Object.entries(filter).forEach(([key, value]) => {
      if (value) {
        cleanedFilter[key] = value;
      }
    });
    console.log({ page: current, limit: pageSize, ...filter });
    setQuery({ page: current, limit: pageSize, ...filter });
  };

  return (
    <>
      <Table<T>
        columns={columns}
        pagination={{
          defaultPageSize: query?.limit ? Number(query?.limit) : 10,
          current: query?.page ? Number(query?.page) : 1,
          total,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          pageSizeOptions: [10, 20, 50],
          responsive: true,
        }}
        dataSource={data}
        scroll={{ x: true }}
        onChange={changeHandler}
        locale={{
          emptyText: (
            <div style={{ minHeight: "calc( 100vh - 300px )" }} className="flex items-center justify-center">
              <Empty />
            </div>
          ),
        }}
        {...props}
      />
    </>
  );
};

export default CustomTable;
