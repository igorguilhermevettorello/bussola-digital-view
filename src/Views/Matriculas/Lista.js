// import React, { useState, useEffect } from "react";
// // import { Form, Button, Spin } from 'antd';
// // import { useHistory, useParams } from "react-router-dom";
// // import { notificationError } from "../../Components/Funcoes";
// // import Http from "../../Components/Http";
// // import logo from "../../Imagens/safepic.jpeg";

// const MatriculasLista = (props) => {
//   return (
//     <div>
//       lista de matrículas
//     </div>
//   );
// }

// export default MatriculasLista;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, FormOutlined, DeleteOutlined, LockOutlined, FileImageOutlined } from '@ant-design/icons';
import Http from "../../Components/Http";
import { useHistory } from "react-router-dom";
import { notificationError, notificationSuccess, formatDateBR } from "../../Components/Funcoes";
const { confirm } = Modal;

const MatriculasLista = () => {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getMatriculas();
  },[]);

  const getMatriculas = Id => {
    setLoading(true);
    Http({
      method: "GET",
      url: "/matricula"
    }).then((result) => {
      setData(result.data);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      alertMessage();
    });
  }

  const alertMessage = () => {
    notificationError("Falha durante o processo. Entre em contato com o Administrador.");
  }

  /****************************************************************************/
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            setSearchInput(node);
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Limpar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => console.log(searchInput));
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  }

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo({ filteredInfo: filters });
  };

  const strcmp = (a, b) => {
    if (a.toString() < b.toString()) return -1;
    if (a.toString() > b.toString()) return 1;
    return 0;
  }

  const columns = [
    {
      title: 'Aluno',
      dataIndex: 'aluno',
      key: 'aluno',
      width: '50%',
      sorter: {
        compare: (a, b) => {
          return strcmp(a.aluno, b.aluno)
        }
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Turma',
      dataIndex: 'turma',
      key: 'turma',
      width: '50%',
      ...getColumnSearchProps('turma'),
      sorter: {
        compare: (a, b) => {
          return strcmp(a.turma, b.turma)
        }
      },
      sortDirections: ['descend', 'ascend']
    }
  ];

  return <Table
    loading={loading}
    columns={columns}
    dataSource={data}
    onChange={handleChange}
    pagination={{ pageSize: 10 }}
    size="small"/>;
}

export default MatriculasLista;