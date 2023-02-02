import React, { useState } from "react";
import axios from "axios";
import { Upload, Table, message, Spin,Skeleton, Button } from "antd";
import { ImportOutlined,LoadingOutlined  } from '@ant-design/icons';
const customStyles = {
  uploadContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    border: "1px solid #e8e8e8",
    borderRadius: "6px",
    marginTop: "20px",
  },
  uploadText: {
    fontSize: "16px",
    color: "#333",
  },
};

function ParkingList() {
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving,setSaving] =useState(false)
  const columns = fileData.length
    ? Object.keys(fileData[0]).map((key) => ({
        title: key,
        dataIndex: key,
        key: key,
      }))
    : [];

  const onChange = (info) => {
    setLoading(true);
    if (info.file.status === "done") {
      setFileData(info.file.response);
      setLoading(false);
      message.success(`${info.file.name} - Tải lên thành công`);
      console.log(info.file.response)
    } else if (info.file.status === "error") {
      setLoading(false);
      message.error(`${info.file.name} - Tải lên thất bại`);
    }
  };
const saveParkingList=()=>{
  setSaving(true)
  axios.post('http://10.40.12.4:8089/api/saveDataParkinglist',{fileData})
  .then(res=>{
    if(res.data==='ok'){
      message.success('Đã lưu thành công')
      setFileData([])
      setSaving(false)
    }
    else{
      message.error(res.data)
    }
  })
}
  return (
    <div>
    <div className="saveParkingList" style={{
      display:'flex',
      justifyContent: "right",
    }}>
    <Button
          type="primary"
          icon={saving&&fileData.length>0&&<LoadingOutlined />}
          onClick={saveParkingList }
          disabled ={fileData.length >0&& saving!==true?false:true}
        >
          LƯU DỮ LIỆU
        </Button>
    </div>
      <div style={customStyles.uploadContainer} className="custom-upload">
        <Upload
          name="file"
          action="http://10.40.12.4:8089/api/uploadParkinglist"
          onChange={onChange}
          showUploadList={false}
          disabled={!saving?false:true}
        >
          <p style={customStyles.uploadText}>
            Chọn tệp Excel hoặc kéo thả tệp vào đây
          </p>
        </Upload>
      </div>
      {loading ? (
        <div style={{marginTop:20}}> 
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          
          <Skeleton active ={loading}/>
        </div>
        </div>
      ) : (
        fileData.length > 0 && (
          <Table dataSource={fileData} columns={columns} scroll={{ x: "100%" }}/>
        )            
      )}
    </div>
  );
}

export default ParkingList;
