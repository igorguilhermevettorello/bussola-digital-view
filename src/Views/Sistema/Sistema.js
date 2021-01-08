/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from 'antd';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';


const Sistema = (props) => {

  console.log("props", props);

  let teste = props.title;

  const menuAluno = (
    <Menu>
      <Menu.Item key="0">
        <Link to="/aluno">Cadastrar</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link to="/alunos">Listar</Link>
      </Menu.Item>
    </Menu>
  );

  const menuTurma = (
    <Menu>
      <Menu.Item key="2">
        <Link to="/turma">Cadastrar</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/turmas">Listar</Link>
      </Menu.Item>
    </Menu>
  );

  const menuMatriculas = (
    <Menu>
      <Menu.Item key="4">
        <Link to="/matricula">Cadastrar</Link>
      </Menu.Item>
      <Menu.Item key="5">
        <Link to="/matriculas">Listar</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="site-page-header-ghost-wrapper">
      <PageHeader
        ghost={false}
        title="Sistema"
        subTitle={teste}
        extra={[
          <Dropdown overlay={menuAluno} trigger={['click']} key="d0">
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              Alunos <DownOutlined />
            </a>
          </Dropdown>,
          <Dropdown overlay={menuTurma} trigger={['click']} key="d1">
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              Turma <DownOutlined />
            </a>
          </Dropdown>,
          <Dropdown overlay={menuMatriculas} trigger={['click']} key="d2">
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              Matrículas <DownOutlined />
            </a>
          </Dropdown>
        ]}
      >
        <div size="small" className="site-page-content">
          <div>{props.children}</div>
        </div>
      </PageHeader>
    </div>
  );
}

export default Sistema;