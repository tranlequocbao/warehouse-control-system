import React, { useState, useEffect, useRef } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Table, notification, Modal, Button, Input, Space, Spin, Skeleton } from "antd";
import Highlighter from 'react-highlight-words';
import axios from "axios";


function ListPacking() {
      const [dataPacking, setDataPacking] = useState([]);
      const [dataPackingList, setDataPackingList] = useState([]);
      const [open, setOpen] = useState(false);
      const [loading, setLoading] = useState('false')


      //search on table antd
      const [searchText, setSearchText] = useState('');
      const [searchedColumn, setSearchedColumn] = useState('');
      const searchInput = useRef(null);


      useEffect(() => {
            getData("all");
      }, []);
      const getData = (type, invoiceNo = "") => {
            axios
                  .post("http://113.174.246.52:8089/api/returnHISPacking", { type, invoiceNo })
                  .then((res) => {
                        if (res.data === "error") {
                              openNotification("Lỗi lấy dữ liệu từ server", "error");
                        } else {
                              let dataFinal = [];
                              res.data.map((val, index) =>
                                    dataFinal.push({
                                          key: index + 1,
                                          ...val,
                                    })
                              );
                              setDataPacking(dataFinal);
                        }
                  });
      };
      const openNotification = (content, type) => {
            notification[type]({
                  message: "THÔNG BÁO",
                  description: content,
            });
      };



      ///////// function search table antd
      const handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
      };
      const handleReset = (clearFilters) => {
            clearFilters();
            setSearchText('');
      };
      const getColumnSearchProps = (dataIndex) => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
                  <div
                        style={{
                              padding: 8,
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                  >
                        <Input
                              ref={searchInput}
                              placeholder={`Search ${dataIndex}`}
                              value={selectedKeys[0]}
                              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                              style={{
                                    marginBottom: 8,
                                    display: 'block',
                              }}
                        />
                        <Space>
                              <Button
                                    type="primary"
                                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                                    icon={<SearchOutlined />}
                                    size="small"
                                    style={{
                                          width: 90,
                                    }}
                              >
                                    Search
                              </Button>
                              <Button
                                    onClick={() => clearFilters && handleReset(clearFilters)}
                                    size="small"
                                    style={{
                                          width: 90,
                                    }}
                              >
                                    Reset
                              </Button>
                              <Button
                                    type="link"
                                    size="small"
                                    onClick={() => {
                                          confirm({
                                                closeDropdown: false,
                                          });
                                          setSearchText(selectedKeys[0]);
                                          setSearchedColumn(dataIndex);
                                    }}
                              >
                                    Filter
                              </Button>
                              <Button
                                    type="link"
                                    size="small"
                                    onClick={() => {
                                          close();
                                    }}
                              >
                                    close
                              </Button>
                        </Space>
                  </div>
            ),
            filterIcon: (filtered) => (
                  <SearchOutlined
                        style={{
                              color: filtered ? '#1890ff' : undefined,
                        }}
                  />
            ),
            onFilter: (value, record) =>
                  record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                  if (visible) {
                        setTimeout(function () {
                              if (searchInput.current) {
                                    searchInput.current.select();
                              }
                        }, 100);
                  }
            },
            render: (text) =>
                  searchedColumn === dataIndex ? (
                        <Highlighter
                              highlightStyle={{
                                    backgroundColor: '#ffc069',
                                    padding: 0,
                              }}
                              searchWords={[searchText]}
                              autoEscape
                              textToHighlight={text ? text.toString() : ''}
                        />
                  ) : (
                        text
                  ),
      });


      const columns1 = dataPackingList.length
            ? Object.keys(dataPackingList[0]).map((key, index) => ({
                  title: key,
                  dataIndex: key,
                  key: index,
                  // align: 'center',
                  // flex: '1 1 auto',
                  ellipsis: true,
                  resizable: true,
                  width:'200px',
                  ...getColumnSearchProps(key),
            }))
            : [];
      const handleViewPacking = (invoiceNo) => {
            setOpen(true);
            axios
                  .post("http://113.174.246.52:8089/api/returnPacking", { invoiceNo })
                  .then((res) => {
                        if (typeof res.data === "object") {
                              console.log(res.data)
                              let finaldata = res.data
                              finaldata.map((val) => {
                                    delete val['id']
                                    delete val['NAME_FILE']
                                    delete val['PERSON_UP']
                                    delete val['PERSON_CODE']
                                    return val
                              })
                              setLoading(false)
                              setDataPackingList(finaldata)
                        }
                  });
      };
      const handleCancel = () => {
            setOpen(false);
      };
      const column = [
            {
                  title: "STT",
                  dataIndex: 'key',
                  key: "key",
                  ...getColumnSearchProps('key'),
            },
            {
                  title: "Tên tệp đã tải lên",
                  dataIndex: "FILE_NAME",
                  key: "fileName",
                  ...getColumnSearchProps('FILE_NAME'),
            },
            {
                  title: "Người tải lên",
                  dataIndex: "FullName",
                  key: "FullName",
                  ...getColumnSearchProps('FullName'),
            },
            {
                  title: "Ngày tải lên",
                  dataIndex: "DATETIME",
                  key: "datetime",
                  ...getColumnSearchProps('DATETIME'),
            },
            {
                  title: "Số hợp đồng",
                  dataIndex: "INVOICE_NO",
                  key: "invoice",
                  name: "INVOICE_NO",
                  ...getColumnSearchProps('INVOICE_NO'),
            },
            {
                  title: "Thao tác",
                  key: "action",
                  render: (_, record) => (
                        <a onClick={() => handleViewPacking(record.INVOICE_NO)}>View</a>
                  ),
            },
      ];
      return (
            <div >
                  <Table columns={column} dataSource={dataPacking} rowKey="key" />;
                  <Modal
                        width={'100%'}
                        open={open}
                        onCancel={handleCancel}
                        title="PackingList"
                        // footer={[
                        //   <Button key="back" onClick={handleCancel}>
                        //     Return
                        //   </Button>,
                        // ]}
                        footer={null}
                        style={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  >{loading ? (
                        <div style={{ marginTop: 20 }}>
                              <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Spin size="large" />
                              </div>
                              <div
                                    style={{
                                          display: "flex",
                                          justifyContent: "center",
                                    }}
                              >
                                    <Skeleton active={loading} />
                              </div>
                        </div>
                  ) : (
                        dataPackingList.length > 0 && (
                              <Table
                                    dataSource={dataPackingList}
                                    columns={columns1}
                                    rowKey="key"
                                    size="middle"
                                     scroll={{ y: 'calc(100vh - 200px)',x:'100%' }}
                                    pagination={{ showSizeChanger: true, pageSizeOptions: ['50', '100', '150', '200'], defaultPageSize: '100' }}
                              />
                        )
                  )}

                  </Modal>
            </div>
      );
}

export default ListPacking;
