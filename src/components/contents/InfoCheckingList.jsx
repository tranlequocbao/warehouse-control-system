import React, { useState, useEffect, useRef } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Table, notification, Modal, Button, Input, Space, Spin, Skeleton, Popconfirm, Typography, Form } from "antd";
import Highlighter from 'react-highlight-words';
import axios from "axios";


/////////edit cell on table antd
const EditableCell = ({
     editing,
     dataIndex,
     title,
     inputType,
     record,
     index,
     children,
     ...restProps
}) => {

     return (
          <td {...restProps}>
               {editing ? (
                    <Form.Item
                         name={dataIndex}
                         style={{
                              margin: 0,
                         }}
                         rules={[
                              {
                                   required: true,
                                   message: `Vui lòng nhập ${title}!`,
                              },
                         ]}
                    >
                         {<Input />}
                    </Form.Item>
               ) : (
                    children
               )}
          </td>
     );
};
function InfoCheckingList() {
     const [dataCheckingList, setDataCheckingList] = useState([]);
     const [loading, setLoading] = useState('false')
     const [showModal, setShowModal] = useState(false)
     //search on table antd
     const [searchText, setSearchText] = useState('');
     const [searchedColumn, setSearchedColumn] = useState('');
     const searchInput = useRef(null);
     const userUpload = JSON.parse(localStorage.getItem("username"))[0].FullName;
     const userCode = JSON.parse(localStorage.getItem("username"))[0].UID;
     //edit cell table
     const [editingKey, setEditingKey] = useState('')
     const isEditing = (record) => record.key === editingKey;
     const [form] = Form.useForm();
     const [form1] = Form.useForm();
     useEffect(() => {
          getData();
     }, []);
     const getData = () => {
          axios
               .post("http://113.174.246.52:8089/api/returnAllCheckingList")
               .then((res) => {
                    if (typeof res.data === "object") {
                         let dataFinal = res.data
                         for (let i = 0; i < dataFinal.length; i++) {
                              dataFinal[i].key = i + 1
                         }
                         setLoading(false)
                         setDataCheckingList(dataFinal)
                    }
               });
     }

     // thông báo
     const openNotification = (status, type) => {
          notification[type]({
               message: 'THÔNG BÁO',
               description: status,
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
     const columns = [
          {
               title: "STT",
               dataIndex: 'key',
               key: "key",
               width:60,
               align:'center',
               ...getColumnSearchProps('key'),
          },
          {
               title: "MSC",
               dataIndex: "MSC",
               key: "MSC",
               align:'center',
               ...getColumnSearchProps('MSC'),
          },
          {
               title: "ĐƠN VỊ TÍNH",
               dataIndex: "UNIT",
               key: "UNIT",
               ...getColumnSearchProps('UNIT'),
          },
          {
               title: "KIỆN",
               dataIndex: "IDCase",
               key: "IDCase",
               align:'center',
               ...getColumnSearchProps('IDCase'),
          },
          {
               title: "TRẠM CHUYỂN",
               dataIndex: "STATION_FROM",
               key: "STATION_FROM",
               name: "STATION_FROM",
               align:'center',
               ...getColumnSearchProps('STATION_FROM'),
          },
          {
               title: "KHO NHẬN",
               dataIndex: "STATION_RECEIVE",
               key: "STATION_RECEIVE",
               name: "STATION_RECEIVE",
               editable: true,
               align:'center',
               ...getColumnSearchProps('STATION_RECEIVE'),

          },
          {
               title: "Người cập nhật",
               dataIndex: "FullName",
               key: "FullName",
               name: "FullName",
               align:'center',
               ...getColumnSearchProps('FullName'),
          },
          {
               title: "Ngày cập nhật",
               dataIndex: "DATETIME",
               key: "DATETIME",
               name: "DATETIME",
               align:'center',
               ...getColumnSearchProps('DATETIME'),
          },
          {
               title: "Thao tác",
               key: "action",
               align:'center',
               fixed:'right',
               render: (_, record) => {
                    const editable = isEditing(record);
                    return editable ? (
                         <span>
                              <Typography.Link
                                   onClick={() => onSubmitModify(record)}
                                   style={{
                                        marginRight: 8,
                                   }}
                              >
                                   Lưu
                              </Typography.Link>
                              <Popconfirm title="Bạn có muốn hủy?" onConfirm={cancel}>
                                   <a>Hủy</a>
                              </Popconfirm>
                         </span>
                    ) : (
                         <div style={{display:'flex', justifyContent:'center'}}>
                              <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} style={{marginRight:30}}>
                                   Sửa
                              </Typography.Link>
                              <Popconfirm title="Bạn có chắc muốn xoá kiện này không?" onConfirm={() => deleteRow(record)} >
                                   <a style={{color:'red'}}>Xóa</a>
                              </Popconfirm>
                         </div>

                    );
               }
          },
     ];

     const mergedColumns = columns.map((col) => {
          if (!col.editable) {
               return col;
          }
          return {
               ...col,
               onCell: (record) => ({
                    record,
                    inputType: 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
               }),
          };
     });

     const onSubmitModify = async (value) => {
          try {

               value.STATION_RECEIVE = value.STATION_RECEIVE.toUpperCase()
               console.log(value)
               
               const row = await form.validateFields();
               row.userCode=userCode
               console.log(row)
               axios.post('http://113.174.246.52:8089/api/updateCheckinglist', { value, row })
                    .then((res) => {
                         if (res.data == 'ok') {
                              setLoading(true)
                              getData()
                              openNotification("HIỆU CHỈNH DỮ LIỆU THÀNH CÔNG", 'success',)
                              setEditingKey('');
                         }
                         else {
                              openNotification(res.data, 'error',)
                              setEditingKey('');
                              console.log(res.data)
                         }

                    })
          } catch (errInfo) {
               console.log('Validate Failed:', errInfo);
          }

     }
     const deleteRow = async (value) => {
          try {

               value.STATION_RECEIVE = value.STATION_RECEIVE.toUpperCase()
               axios.post('http://113.174.246.52:8089/api/deleteCheckinglist', { value })
                    .then((res) => {
                         if (res.data == 'ok') {
                              setLoading(true)
                              getData()
                              openNotification("HIỆU CHỈNH DỮ LIỆU THÀNH CÔNG", 'success',)
                              setEditingKey('');
                         }
                         else {
                              openNotification(res.data, 'error',)
                              setEditingKey('');
                              console.log(res.data)
                         }
                    })
          } catch (errInfo) {
               console.log('Validate Failed:', errInfo);
          }
     };
     const cancel = () => {
          setEditingKey('');
     };
     const edit = (record) => {
          form.setFieldsValue({
               ...record,
          });
          setEditingKey(record.key);
     };
     const openModal = (show = false) => {
          setShowModal(show)
     }
     const onFinish =(values)=>{
          values.userCode = userCode
          try {
               axios.post('http://113.174.246.52:8089/api/addCheckinglist', { values })
               .then((res) => {
                    if (res.data == 'ok') {
                         openModal(false)
                         setLoading(true)
                         getData()
                         openNotification("THÊM MỚI THÀNH CÔNG", 'success',)
                         setEditingKey('');
                         form1.resetFields();
                    }
                    else {
                         openNotification(res.data, 'error',)
                         setEditingKey('');
                         console.log(res.data)
                    }
               })
          } catch (error) {
               console.log(error)
               openNotification("Lỗi trong quá trình thêm mới dữ liệu Checking List")
          }
         
     }
     const onFinishFailed =(errInfo)=>{
          console.log(errInfo)
          openNotification('Lỗi thêm checking lít','error')

     }
     const onReset = () => {
          form1.resetFields();
        };
     return (
          <div>
               <Modal
                    title="Thêm Thông Tin"
                    centered
                    open={showModal}
                    onCancel={() => openModal(false)}
                    footer={[]}
               >
                    <Form
                         name="basic"
                         labelCol={{
                              span: 8,
                         }}
                         wrapperCol={{
                              span: 16,
                         }}
                         style={{
                              maxWidth: 600,
                         }}
                         initialValues={{
                              remember: true,
                         }}
                         onFinish={onFinish}
                         onFinishFailed={onFinishFailed}
                         autoComplete="off"
                         form={form1}
                    >
                         <Form.Item
                              label="MSC"
                              name="msc"
                          
                              rules={[
                                   {
                                        required: true,
                                        message: 'Nhập mã MSC!',
                                   },
                              ]}
                         >
                              <Input     placeholder="Nhập mã MSC"/>
                         </Form.Item>

                         <Form.Item
                              label="Đơn vị"
                              name="unit"
                              rules={[
                                   {
                                        required: true,
                                        message: 'Nhập đơn vị!',
                                   },
                              ]}
                         >
                              <Input  placeholder="Nhập đơn vị tính"/>
                         </Form.Item>
                         <Form.Item
                              label="Kiện"
                              name="idCase"
                              rules={[
                                   {
                                        required: true,
                                        message: 'Nhập mã kiện. Ví dụ "01-01"',
                                   },
                              ]}
                         >
                              <Input  placeholder=" Lưu ý! nhập theo mẫu.Ví dụ: '01-01'"/>
                         </Form.Item>
                         <Form.Item
                              label="Trạm Chuyển"
                              name="STATION_FROM"
                              rules={[
                                   {
                                        required: true,
                                        message: 'Nhập trạm chuyển',
                                   },
                              ]}
                         >
                              <Input  placeholder="Nhập trạm chuyển tới" />
                         </Form.Item>
                         <Form.Item
                              label="Kho Nhận"
                              name="STATION_RECEIVE"
                              rules={[
                                   {
                                        required: true,
                                        message: 'Nhập Kho nhận',
                                   },
                              ]}
                         >
                              <Input  placeholder="Nhập kho nhận"/>
                         </Form.Item>
                         <Form.Item
                              wrapperCol={{
                                   offset: 8,
                                   span: 16,
                              }}
                         >
                              <Button type="primary" htmlType="submit" style={{marginRight:8}}>
                                   Lưu
                              </Button>
                              <Button htmlType="button" onClick={()=>openModal(false)}>
                                   Huỷ bỏ
                              </Button>
                              <Button type="link" onClick={onReset}>
                                   Trống dữ liệu
                              </Button>
                         </Form.Item>
                    </Form>
               </Modal>
               <div style={{
                    display: 'flex',
                    justifyContent: 'right',
                    marginBottom: 20,
                    marginTop: 0
               }}>
                    <Button onClick={() => openModal(true)}>Import</Button>
               </div>
               {loading ? (
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
                    dataCheckingList.length > 0 && (
                         <Form form={form} component={false}>
                              <Table
                                   components={{
                                        body: {
                                             cell: EditableCell,
                                        },
                                   }}
                                   rowClassName="editable-row"
                                   dataSource={dataCheckingList}
                                   columns={mergedColumns}
                                   rowKey="key"
                                   size="middle"
                                   scroll={{ y: 'calc(100vh - 380px)', }}
                                   pagination={{ showSizeChanger: true, pageSizeOptions: ['50', '100', '150', '200'], defaultPageSize: '100' }}
                              />
                         </Form>
                    )
               )}</div>
     )
}

export default InfoCheckingList