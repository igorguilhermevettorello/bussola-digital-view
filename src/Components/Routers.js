// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Sistema from "../Views/Sistema/Sistema";
import AlunosFormulario from "../Views/Alunos/Formulario";
import AlunosLista from "../Views/Alunos/Lista";
import TurmasFormulario from "../Views/Turmas/Formulario";
import TurmasLista from "../Views/Turmas/Lista";
import MatriculasFormulario from "../Views/Matriculas/Formulario";
import MatriculasLista from "../Views/Matriculas/Lista";

const Routers = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" key="0" exact>
        <Sistema key="s0" title={"Bem vindo ao sistema"}>
        </Sistema>
      </Route>

      <Route path="/aluno" key="1" exact>
        <Sistema key="s1" title={"Cadastrar de aluno"}>
          <AlunosFormulario />
        </Sistema>
      </Route>

      <Route path="/aluno/:id" key="2" exact>
        <Sistema key="s2" title={"Alterar aluno"}>
          <AlunosFormulario />
        </Sistema>
      </Route>

      <Route path="/alunos" key="3" exact>
        <Sistema key="s3" title={"Listagem de alunos"}>
          <AlunosLista />
        </Sistema>
      </Route>

      <Route path="/turma" key="4" exact>
        <Sistema key="s4" title={"Cadastrar de turma"}>
          <TurmasFormulario />
        </Sistema>
      </Route>

      <Route path="/turma/:id" key="5" exact>
        <Sistema key="s5" title={"Alterar turma"}>
          <TurmasFormulario />
        </Sistema>
      </Route>

      <Route path="/turmas" key="6" exact>
        <Sistema key="s6" title={"Listagem de turmas"}>
          <TurmasLista />
        </Sistema>
      </Route>

      <Route path="/matricula" key="7" exact>
        <Sistema key="s7" title={"Cadastrar de matrícula"}>
          <MatriculasFormulario />
        </Sistema>
      </Route>

      <Route path="/matricula/:id" key="8" exact>
        <Sistema key="s8" title={"Alterar matrícula"}>
          <MatriculasFormulario />
        </Sistema>
      </Route>

      <Route path="/matriculas" key="9" exact>
        <Sistema key="s9" title={"Listagem de matrículas"}>
          <MatriculasLista />
        </Sistema>
      </Route>
    </Switch>
  </BrowserRouter>
);


export default Routers;