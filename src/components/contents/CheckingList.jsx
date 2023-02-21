import React, { useState } from "react";
import axios from "axios";
import { Upload, Table, message, Spin, Skeleton, Button } from "antd";
import { ImportOutlined, LoadingOutlined } from "@ant-design/icons";

function CheckingList() {
      const [fileData, setFileData] = useState([]);
      const [loading, setLoading] = useState(false);
      const [saving, setSaving] = useState(false);
      const [fileName, setFileName] = useState("");
      const columns = [
            {
                  title: "Loại xe",
                  dataIndex: "__EMPTY",
                  key: "__EMPTY",
            },
            {
                  title: "ĐVT",
                  dataIndex: "__EMPTY_1",
                  key: "__EMPTY_1",
            },
            {
                  title: "Mã số thùng",
                  dataIndex: "__EMPTY_2",
                  key: "__EMPTY_2",
            },
            {
                  title: "Tên Trạm",
                  dataIndex: "__EMPTY_3",
                  key: "__EMPTY_3",
            },
            {
                  title: "Kho Nhận",
                  dataIndex: "__EMPTY_4",
                  key: "__EMPTY_4",
            },
      ];
      const customStyles = {
            uploadContainer: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // height: "200px",
                  border: "1px solid #e8e8e8",
                  borderRadius: "6px",
                  marginTop: "20px",
            },
            uploadText: {
                  fontSize: "16px",
                  color: "#333",
            },
      };
      const userUpload = JSON.parse(localStorage.getItem("username"))[0].FullName;
      const userCode = JSON.parse(localStorage.getItem("username"))[0].UID;
      const onChange = (info) => {
            setLoading(true);
            if (info.file.status === "done") {
                  const data = info.file.response;
                  for (let i = 0; i < data.length; i++) {
                        data[i].key = i + 1;
                  }
                  setFileData(data);

                  setLoading(false);
                  message.success(`${info.file.name} - Tải lên thành công`);
                  setFileName(info.file.name);
            } else if (info.file.status === "error") {
                  setLoading(false);
                  message.error(`${info.file.name} - Tải lên thất bại`);
            }
      };
      const savePackingList = () => {
            setSaving(true);
            axios
                  .post("http://113.174.246.52:8089/api/saveDataCheckinglist", {
                        fileData,
                        fileName,
                        userUpload,
                        userCode,
                  })
                  .then((res) => {
                        if (res.data === "ok") {
                              message.success("Đã lưu thành công");
                              setFileData([]);
                              setSaving(false);
                              setFileName("");
                        } else {
                              message.error(res.data);
                              setFileData([]);
                              setSaving(false);
                              setFileName("");
                        }
                        console.log(res.data);
                  });
      };
      return (
            <div>
                  <div
                        className="saveCheckingList"
                        style={{
                              display: "flex",
                              justifyContent: "space-between",
                        }}
                  >
                        <div>
                              {fileName != "" && <p>{`Tên tệp đã tải lên: ${fileName}`}</p>}
                        </div>
                        <Button
                              type="primary"
                              icon={saving && fileData.length > 0 && <LoadingOutlined />}
                              onClick={savePackingList}
                              disabled={fileData.length > 0 && saving !== true ? false : true}
                        >
                              LƯU DỮ LIỆU
                        </Button>
                  </div>
                  <div style={customStyles.uploadContainer} className="custom-upload">
                        <Upload
                              name="file"
                              action="http://113.174.246.52:8089/api/uploadCheckinglist"
                              onChange={onChange}
                              showUploadList={false}
                              disabled={!saving ? false : true}
                              height={20}
                        >
                              <p style={customStyles.uploadText}>
                                    Chọn tệp Excel hoặc kéo thả tệp vào đây
                              </p>
                        </Upload>
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
                        fileData.length > 0 && (
                              <Table
                                    dataSource={fileData}
                                    columns={columns}
                                    scroll={{ x: "100%" }}
                              />
                        )
                  )}
            </div>
      );
}

export default CheckingList;

