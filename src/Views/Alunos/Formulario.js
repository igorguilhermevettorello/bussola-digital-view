/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Spin, Row, Col, Select, ConfigProvider, DatePicker } from 'antd';
import Http from "../../Components/Http";
import { notificationError, notificationSuccess, formatDateBR, formatDateDB } from "../../Components/Funcoes";
import { useHistory, useParams } from "react-router-dom";
import pt_BR from "antd/es/locale-provider/pt_BR";
import moment from "moment";
import "moment/locale/pt";
moment.locale("pt");

const { Option } = Select;

const AlunosFormulario = (props) => {
  let history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [keyFomulario, setKeyFomulario] = useState(1);
  const [dados, setDados] = useState({
    id: "",
    codigo: "",
    nome: "",
    sexo: "",
    nascimento: ""
  });

  const [dataNascimento, setDataNascimento] = useState(null);

  let { id } = useParams();

  useEffect(() => {
    if (id) {
      getAluno(id);
    }
  },[]);

  const getAluno = (id) => {

    setLoading(true);
    let url = `/aluno/${id}`;
    Http({
      method: "GET",
      url: url,
    }).then((result) => {
      setLoading(false);
      let _dados = result.data;
      _dados.codigo = _dados.id.toString().padStart(10, "0");
      _dados.nascimento = formatDateBR(_dados.nascimento);
      setDataNascimento(_dados.nascimento);
      setDados(_dados);
      setKeyFomulario(Math.random());
      form.setFieldsValue(_dados);
    }).catch((error) => {
      setLoading(false);
      alertMessage();
    });
  }

  const alertMessage = () => {
    notificationError("Falha durante o processo. Entre em contato com o Administrador.");
  }

  const onFinish = formulario => {
    let _method = `POST`;
    let _url = `/aluno`;
    if (formulario.id !== "") {
      _method = `PUT`;
      _url = `/aluno/${formulario.id}`;
    }

    setLoading(true);
    Http({
      method: _method,
      url: _url,
      data: {
        nome: formulario.nome,
        sexo: formulario.sexo,
        nascimento: formatDateDB(formulario.nascimento)
      }
    }).then((result) => {
      setLoading(false);
      let _dados = result.data;
      _dados.codigo = _dados.id.toString().padStart(10, "0");
      _dados.nascimento = formatDateBR(_dados.nascimento);
      setDados(_dados);
      setKeyFomulario(Math.random());
      form.setFieldsValue(_dados);
      notificationSuccess("Dados atualizados com sucesso.");
      history.push(`/aluno/${_dados.id}`);
    }).catch((error) => {
      setLoading(false);
      if (typeof error.response.data != "undefined" && Array.isArray(error.response.data)) {
        error.response.data.map(item => {
          form.setFields([
            {name: item.campo, errors:[item.descricao]}
          ]);
        });
      } else {
        alertMessage();
      }
    });
  };

  const validaCampoNome = (rule, value, callback) => {
    return new Promise((resolve, reject) => {
      if (typeof value !== "undefined" && value !== null && value.trim() !== "") {
        resolve();
      } else {
        reject(`Por favor preencha o campo, nome é obrigatório.`);
      }
    });
  };

  const validaCampoSexo = (rule, value, callback) => {
    return new Promise((resolve, reject) => {
      if (typeof value !== "undefined" && value !== null && value.trim() !== "") {
        resolve();
      } else {
        reject(`Por favor preencha o campo, sexo é obrigatório.`);
      }
    });
  };

  const validaCampoNascimento = (rule, value, callback) => {
    return new Promise((resolve, reject) => {
      if (typeof value !== "undefined" && value !== null && value.trim() !== "") {
        resolve();
      } else {
        reject(`Por favor preencha o campo, data de nascimento é obrigatório.`);
      }
    });
  };

  const handleCancel = () => {
    history.push(`/`);
  }

  const handleClean = (event) => {
    event.preventDefault();

    let dados = {
      id: "",
      codigo: "",
      nome: "",
      sexo: "",
      nascimento: ""
    };

    setDados(dados);
    setKeyFomulario(Math.random());
    form.setFieldsValue(dados);
    setDataNascimento(null);

    history.push(`/aluno`);
  }

  const enableButton = () => {
    return (dados.id === "");
  }

  const onChangeNascimento = (elemento, valor) => {

    form.setFieldsValue({
      "nascimento" : valor
    });

    form.setFields([
      {name: "nascimento", errors:[]}
    ]);

    setDataNascimento(valor);
  }

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        initialValues={{
          id: dados.id,
          codigo: dados.codigo,
          nome: dados.nome,
          sexo: dados.sexo,
          nascimento: dados.nascimento
        }}
        key={keyFomulario}
        onFinish={onFinish}
      >
        <Row gutter={0} type="flex">
          <Form.Item name="id" hidden>
            <Input type="hidden" />
          </Form.Item>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <label className="label-formulario">Código</label>
            <Form.Item name="codigo">
              <Input type="text" disabled={true} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <label className="label-formulario">Nome</label>
            <Form.Item name="nome" rules={[{ validator: validaCampoNome }]} >
              <Input type="text" placeholder="Preencha o campo" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <label className="label-formulario">Sexo</label>
            <Form.Item name="sexo" rules={[{ validator: validaCampoSexo }]}>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Selecione"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="F">Feminino</Option>
                <Option value="M">Masculino</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <label className="label-formulario">Data de nascimento</label>
            <Form.Item name="nascimento" rules={[{ validator: validaCampoNascimento }]}>
              <ConfigProvider locale={pt_BR}>
                <DatePicker
                  defaultValue={(dataNascimento === null) ? null : moment(dataNascimento, "DD/MM/YYYY")}
                  onChange={onChangeNascimento}
                  format="DD/MM/YYYY"
                  style={{width: "100%"}}/>
              </ConfigProvider>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div>
              <Row gutter={0} type="flex">
                <Col xs={0} sm={0} md={15} lg={15} xl={15}></Col>
                <Col xs={8} sm={8} md={3} lg={3} xl={3}>
                  <Form.Item hidden={enableButton()}>
                    <Button htmlType="submit" className="login-form-button" onClick={handleClean} block>
                      Limpar
                    </Button>
                  </Form.Item>
                </Col>
                <Col xs={8} sm={8} md={3} lg={3} xl={3}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" onClick={handleCancel} block danger>
                      Cancelar
                    </Button>
                  </Form.Item>
                </Col>
                <Col xs={8} sm={8} md={3} lg={3} xl={3}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" block>
                      Salvar
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}

export default AlunosFormulario;