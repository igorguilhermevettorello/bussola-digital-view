/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Form, Button, Spin, Row, Col, Select } from 'antd';
import Http from "../../Components/Http";
import { notificationError, notificationSuccess } from "../../Components/Funcoes";
import { useHistory } from "react-router-dom";

const { Option } = Select;

const MatriculasFormulario = (props) => {
  let history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [keyFomulario, setKeyFomulario] = useState(1);
  const [dados, setDados] = useState({
    aluno_id: "",
    turma_id: ""
  });

  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    getAlunos();
    getTurmas();
  },[]);

  const getTurmas = () => {
    setLoading(true);
    Http({
      method: "GET",
      url: "turma",
    }).then((result) => {
      setLoading(false);
      setTurmas(result.data);
      setKeyFomulario(Math.random());
    }).catch((error) => {
      setLoading(false);
      alertMessage();
    });
  }

  const getAlunos = () => {
    setLoading(true);
    Http({
      method: "GET",
      url: "aluno",
    }).then((result) => {
      setLoading(false);
      setAlunos(result.data);
      setKeyFomulario(Math.random());
    }).catch((error) => {
      setLoading(false);
      alertMessage();
    });
  }

  const alertMessage = () => {
    notificationError("Falha durante o processo. Entre em contato com o Administrador.");
  }

  const onFinish = formulario => {
    setLoading(true);
    Http({
      method: `POST`,
      url: `/matricula`,
      data: {
        aluno_id: formulario.aluno_id,
        turma_id: formulario.turma_id
      }
    }).then((result) => {
      setLoading(false);
      let _dados = result.data;
      setDados(_dados);
      setKeyFomulario(Math.random());
      form.setFieldsValue(_dados);
      notificationSuccess("Dados atualizados com sucesso.");

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

    // let _method = `POST`;
    // let _url = `/turma`;
    // if (formulario.id !== "") {
    //   _method = `PUT`;
    //   _url = `/turma/${formulario.id}`;
    // }

    // setLoading(true);
    // Http({
    //   method: _method,
    //   url: _url,
    //   data: {
    //     nome: formulario.nome
    //   }
    // }).then((result) => {
    //   setLoading(false);
    //   let _dados = result.data;
    //   _dados.codigo = _dados.id.toString().padStart(10, "0");
    //   setDados(_dados);
    //   setKeyFomulario(Math.random());
    //   form.setFieldsValue(_dados);
    //   notificationSuccess("Dados atualizados com sucesso.");
    //   history.push(`/turma/${_dados.id}`);
    // }).catch((error) => {
    //   setLoading(false);
    //   if (typeof error.response.data != "undefined" && Array.isArray(error.response.data)) {
    //     error.response.data.map(item => {
    //       form.setFields([
    //         {name: item.campo, errors:[item.descricao]}
    //       ]);
    //     });
    //   } else {
    //     alertMessage();
    //   }
    // });
  };

  const validaCampoAluno = (rule, value, callback) => {
    return new Promise((resolve, reject) => {
      if (typeof value !== "undefined" && value !== null && value !== "") {
        resolve();
      } else {
        reject(`Por favor preencha o campo, aluno é obrigatório.`);
      }
    });
  };

  const validaCampoTurma = (rule, value, callback) => {
    return new Promise((resolve, reject) => {
      if (typeof value !== "undefined" && value !== null && value !== "") {
        resolve();
      } else {
        reject(`Por favor preencha o campo, turma é obrigatório.`);
      }
    });
  };

  const handleCancel = () => {
    history.push(`/`);
  }

  const handleClean = (event) => {
    event.preventDefault();

    let dados = {
      aluno_id: "",
      turma_id: ""
    };

    setDados(dados);
    setKeyFomulario(Math.random());
    form.setFieldsValue(dados);

    history.push(`/matricula`);
  }

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        initialValues={{
          aluno_id: dados.aluno_id,
          turma_id: dados.turma_id
        }}
        key={keyFomulario}
        onFinish={onFinish}
      >
        <Row gutter={0} type="flex">
          {/* <Form.Item name="id" hidden>
            <Input type="hidden" />
          </Form.Item>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <label className="label-formulario">Código</label>
            <Form.Item name="codigo">
              <Input type="text" disabled={true} />
            </Form.Item>
          </Col> */}

          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <label className="label-formulario">Aluno</label>
            <Form.Item name="aluno_id" rules={[{ validator: validaCampoAluno }]} >
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Selecione"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {alunos.map(aluno => (
                  <Option value={aluno.id} key={aluno.id}>{aluno.nome}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <label className="label-formulario">Turma</label>
            <Form.Item name="turma_id" rules={[{ validator: validaCampoTurma }]} >
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Selecione"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {turmas.map(turma => (
                  <Option value={turma.id} key={turma.id}>{turma.nome}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div>
              <Row gutter={0} type="flex">
                <Col xs={0} sm={0} md={15} lg={15} xl={15}></Col>
                <Col xs={8} sm={8} md={3} lg={3} xl={3}>
                  <Form.Item>
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

export default MatriculasFormulario;