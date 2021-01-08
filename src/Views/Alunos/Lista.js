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

const AlunosLista = () => {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getAlunos();
  },[]);

  const getAlunos = Id => {
    setLoading(true);
    Http({
      method: "GET",
      url: "/aluno"
    }).then((result) => {
      let _dados = result.data.map(item => {
        return {
          id: item.id,
          codigo: item.id.toString().padStart(10, "0"),
          nome: item.nome,
          sexo: (item.sexo === "M") ? "Masculino" : "Feminino",
          nascimento: formatDateBR(item.nascimento)
        }
      });
      setData(_dados);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      alertMessage();
    });
  }

  const actDeletarAluno = id => {
    console.log("id", id);

    setLoading(true);
    let url = `/aluno/${id}`;
    Http({
      method: "DELETE",
      url: url,
    }).then((result) => {
      setLoading(false);
      notificationSuccess("Registro excluido com sucesso.");
      let dados = [...data];
      dados = dados.filter(item => item.id !== id).map(item => item);
      setData(dados);
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

  const editarAluno = (id) => {
    history.push(`/aluno/${id}`);
  }

  const deletarAluno = (id) => {
    confirm({
      title: 'Deletar aluno',
      content: 'Você deseja excluir esse aluno?',
      onOk() {
        actDeletarAluno(id);
      },
      onCancel() {},
    });
  }

  const columns = [
    {
      title: 'Opçoes',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      render: (id, item) => {
        return (
          <div>
            <Button
              type="primary"
              icon={<FormOutlined />}
              onClick={() => editarAluno(id)}></Button>

            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() => deletarAluno(id)}></Button>
          </div>
        )
      }
    },
    {
      title: 'Código',
      dataIndex: 'codigo',
      key: 'codigo',
      width: '10%',
      sorter: {
        compare: (a, b) => {
          return strcmp(a.codigo, b.codigo)
        }
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      width: '40%',
      ...getColumnSearchProps('nome'),
      sorter: {
        compare: (a, b) => {
          return strcmp(a.nome, b.nome)
        }
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Sexo',
      dataIndex: 'sexo',
      key: 'sexo',
      width: '15%',
      ...getColumnSearchProps('sexo'),
      sorter: {
        compare: (a, b) => {
          return strcmp(a.sexo, b.sexo)
        }
      },
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Nascimento',
      dataIndex: 'nascimento',
      key: 'nascimento',
      width: '15%',
      ...getColumnSearchProps('nascimento'),
      sorter: {
        compare: (a, b) => {
          return strcmp(a.nascimento, b.nascimento)
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

export default AlunosLista;