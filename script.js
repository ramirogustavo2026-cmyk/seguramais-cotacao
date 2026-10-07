let etapaAtual = 1;
let tipoSeguroAtual = 'Auto';

// Mapeamento de Ícones por Serviço
const iconesServico = {
    'Auto': 'car',
    'Moto': 'bike',
    'Caminhão': 'truck',
    'Vida': 'heart',
    'Diversos': 'shield',
    'Residencial': 'home',
    'Empresarial': 'building-2'
};

// Lista de Profissões Pré-fixadas
const profissoesPreFixadas = [
    "Administrador", "Advogado", "Analista de Sistemas / TI", "Aposentado / Pensionista",
    "Arquiteto", "Assistente Social", "Autônomo", "Bancário", "Biólogo",
    "Caminhoneiro / Motorista de Carga", "Comerciante / Empresário", "Contador / Auditor",
    "Corretor de Imóveis", "Corretor de Seguros", "Dentista", "Dermatologista",
    "Designer / Publicitário", "Economista", "Educador Físico / Personal Trainer",
    "Empresário", "Enfermeiro", "Engenheiro", "Estudante", "Farmacêutico",
    "Fisioterapeuta", "Funcionário Público", "Jornalista / Comunicador", "Médico",
    "Motorista / Entregador", "Nutricionista", "Professor / Educador", "Psicólogo",
    "Técnico em Enfermagem", "Técnico em Informática", "Veterinário", "Outras Atividades"
];

// 1. ABRIR E FECHAR MODAL
function abrirModal(servico) {
    tipoSeguroAtual = servico;
    const modal = document.getElementById('modal-overlay');
    const headerText = document.getElementById('modal-header-text');
    const headerIcon = document.getElementById('modal-header-icon');

    if (headerText) headerText.innerText = `SEGURO ${servico.toUpperCase()}`;
    
    if (headerIcon) {
        const nomeIcone = iconesServico[servico] || 'shield';
        headerIcon.innerHTML = `<i data-lucide="${nomeIcone}"></i>`;
        lucide.createIcons();
    }

    // Ocultar todos os fluxos específicos
    const fluxoAuto = document.getElementById('fluxo-auto');
    const fluxoMoto = document.getElementById('fluxo-moto');
    const fluxoCaminhao = document.getElementById('fluxo-caminhao');
    const fluxoVida = document.getElementById('fluxo-vida');
    const fluxoDiversos = document.getElementById('fluxo-diversos');
    const fluxoResidencial = document.getElementById('fluxo-residencial');
    const fluxoEmpresarial = document.getElementById('fluxo-empresarial');

    if (fluxoAuto) fluxoAuto.style.display = 'none';
    if (fluxoMoto) fluxoMoto.style.display = 'none';
    if (fluxoCaminhao) fluxoCaminhao.style.display = 'none';
    if (fluxoVida) fluxoVida.style.display = 'none';
    if (fluxoDiversos) fluxoDiversos.style.display = 'none';
    if (fluxoResidencial) fluxoResidencial.style.display = 'none';
    if (fluxoEmpresarial) fluxoEmpresarial.style.display = 'none';

    // Mostrar o fluxo correto
    if (servico === 'Moto' && fluxoMoto) {
        fluxoMoto.style.display = 'block';
    } else if (servico === 'Caminhão' && fluxoCaminhao) {
        fluxoCaminhao.style.display = 'block';
    } else if (servico === 'Vida' && fluxoVida) {
        fluxoVida.style.display = 'block';
    } else if (servico === 'Diversos' && fluxoDiversos) {
        fluxoDiversos.style.display = 'block';
    } else if (servico === 'Residencial' && fluxoResidencial) {
        fluxoResidencial.style.display = 'block';
    } else if (servico === 'Empresarial' && fluxoEmpresarial) {
        fluxoEmpresarial.style.display = 'block';
    } else if (fluxoAuto) {
        fluxoAuto.style.display = 'block';
    }

    etapaAtual = 1;
    mostrarEtapa(etapaAtual);
    limparErros();
    
    if (modal) modal.style.display = 'flex';
}

function fecharModal() {
    const modal = document.getElementById('modal-overlay');
    const form = document.getElementById('form-cotacao');

    if (modal) {
        modal.style.display = 'none';
    }

    // Limpa os valores preenchidos
    if (form) {
        form.reset();
    }

    // Esconde novamente todos os campos condicionais
    document.querySelectorAll('[id^="cond-"]').forEach(elemento => {
        elemento.style.display = 'none';
    });

    // Esconde outros blocos condicionais que não começam com "cond-"
    const camposOutraPessoa = document.getElementById('campos-outra-pessoa');
    if (camposOutraPessoa) {
        camposOutraPessoa.style.display = 'none';

        camposOutraPessoa.querySelectorAll('input').forEach(campo => {
            campo.removeAttribute('required');
        });
    }

    const grupoTipoCarga = document.getElementById('grp-p2-tipo-carga');
    if (grupoTipoCarga) {
        grupoTipoCarga.style.display = 'none';
    }

    const alertaIdade = document.getElementById('alerta-bloqueio-idade');
    if (alertaIdade) {
        alertaIdade.style.display = 'none';
    }

    // Reativa o botão Próximo da Moto
    const btnMoto = document.getElementById('btn-next-step-4-moto');
    if (btnMoto) {
        btnMoto.disabled = false;
    }

    // Volta "Segurado" como condutor padrão do Auto
    const botoesCondutor = document.querySelectorAll('#step-3-auto .btn-option');

    botoesCondutor.forEach(botao => {
        botao.classList.remove('active');
    });

    if (botoesCondutor.length > 0) {
        botoesCondutor[0].classList.add('active');
    }

    etapaAtual = 1;

    limparErros();
}

// 2. NAVEGAÇÃO ENTRE ETAPAS
function mostrarEtapa(numero) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });

    if (numero === 1 || numero === 2) {
        const step = document.getElementById(`step-${numero}`);
        if (step) {
            step.classList.add('active');
            step.style.display = 'block';
        }
    } else {
        let sufixo = 'auto';
        if (tipoSeguroAtual === 'Moto') sufixo = 'moto';
        if (tipoSeguroAtual === 'Caminhão') sufixo = 'caminhao';
        if (tipoSeguroAtual === 'Vida') sufixo = 'vida';
        if (tipoSeguroAtual === 'Diversos') sufixo = 'diversos';
        if (tipoSeguroAtual === 'Residencial') sufixo = 'residencial';
        if (tipoSeguroAtual === 'Empresarial') sufixo = 'empresarial';

        const step = document.getElementById(`step-${numero}-${sufixo}`);
        if (step) {
            step.classList.add('active');
            step.style.display = 'block';
        }
    }
}

function proximaEtapa() {
    if (validarEtapaAtual()) {
        let maxEtapas = 5;

        if (tipoSeguroAtual === 'Diversos') maxEtapas = 3;
        if (tipoSeguroAtual === 'Residencial') maxEtapas = 5;
        if (tipoSeguroAtual === 'Empresarial') maxEtapas = 8;

        if (etapaAtual < maxEtapas) {
            etapaAtual++;
            mostrarEtapa(etapaAtual);
        }
    }
}

function etapaAnterior() {
    if (etapaAtual > 1) {
        etapaAtual--;
        mostrarEtapa(etapaAtual);
    }
}

// 3. SELEÇÃO DE CONDUTOR (AUTO)
function selecionarTipoCondutor(tipo, elemento) {
    const parent = elemento.closest('.options-grid');
    if (parent) {
        const botoes = parent.querySelectorAll('.btn-option');
        botoes.forEach(btn => btn.classList.remove('active'));
    }
    elemento.classList.add('active');

    const containerOutraPessoa = document.getElementById('campos-outra-pessoa');
    if (!containerOutraPessoa) return;

    const camposOutro = containerOutraPessoa.querySelectorAll('input');

    if (tipo === 'outra_pessoa') {
        containerOutraPessoa.style.display = 'block';
        camposOutro.forEach(c => c.setAttribute('required', 'true'));
    } else {
        containerOutraPessoa.style.display = 'none';
        camposOutro.forEach(c => {
            c.removeAttribute('required');
            limparErroCampo(c);
        });
    }
}

// 4. LÓGICA CONDICIONAL DO SEGURO MOTO
function verificarUsoMoto(valor) {
    const condLocal = document.getElementById('cond-p1-local');
    const condKm = document.getElementById('cond-p1-km');

    if (condLocal) condLocal.style.display = (valor === '1' || valor === '3') ? 'block' : 'none';
    if (condKm) condKm.style.display = (valor === '2' || valor === '3') ? 'block' : 'none';
}

function verificarGaragemNoite(valor) {
    const condTipo = document.getElementById('cond-p2-tipo-garagem');
    const condOnde = document.getElementById('cond-p2-onde-estaciona');

    if (condTipo) condTipo.style.display = (valor === '1') ? 'block' : 'none';
    if (condOnde) condOnde.style.display = (valor === '2') ? 'block' : 'none';
}

function verificarEstacionamentoTrabalho(valor) {
    const condSeguranca = document.getElementById('cond-p3-seguranca');
    const condAlerta = document.getElementById('cond-p3-alerta-rua');

    if (condSeguranca) condSeguranca.style.display = (valor === '2') ? 'block' : 'none';
    if (condAlerta) condAlerta.style.display = (valor === '3') ? 'block' : 'none';
}

function verificarEntregas(valor) {
    const condHoras = document.getElementById('cond-p4-horas');
    if (condHoras) condHoras.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarIdadeMoto(valor) {
    const alerta = document.getElementById('alerta-bloqueio-idade');
    const btnProx = document.getElementById('btn-next-step-4-moto');

    if (valor === 'menos_18') {
        if (alerta) alerta.style.display = 'block';
        if (btnProx) btnProx.disabled = true;
    } else {
        if (alerta) alerta.style.display = 'none';
        if (btnProx) btnProx.disabled = false;
    }
}

function verificarHabilitacaoMoto(valor) {
    const condExp = document.getElementById('cond-p6-experiencia');
    if (condExp) condExp.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarFinanciamento(valor) {
    const condFin = document.getElementById('cond-p7-financeira');
    if (condFin) condFin.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarFinalidadeSeguro(valor) {
    const condCob = document.getElementById('cond-p8-coberturas');
    if (condCob) condCob.style.display = (valor === '4') ? 'block' : 'none';
}

function verificarAcidentes(valor) {
    const condDetalhes = document.getElementById('cond-p9-detalhes-acidente');
    const condObs = document.getElementById('cond-p9-observacoes');

    if (condDetalhes) condDetalhes.style.display = (valor === '1') ? 'block' : 'none';
    if (condObs) condObs.style.display = (valor === '2') ? 'block' : 'none';
}

// 5. LÓGICA CONDICIONAL DO SEGURO CAMINHÃO
function verificarFinalidadeCaminhao(valor) {
    const divCargas = document.getElementById('cond-p1-transporte-cargas');
    const divUsoProprio = document.getElementById('cond-p1-uso-proprio');
    const divServico = document.getElementById('cond-p1-servico');
    const divOutro = document.getElementById('cond-p1-outro');
    const grpP2 = document.getElementById('grp-p2-tipo-carga');

    if (divCargas) divCargas.style.display = (valor === '1') ? 'block' : 'none';
    if (divUsoProprio) divUsoProprio.style.display = (valor === '2') ? 'block' : 'none';
    if (divServico) divServico.style.display = (valor === '3') ? 'block' : 'none';
    if (divOutro) divOutro.style.display = (valor === '4') ? 'block' : 'none';

    if (grpP2) grpP2.style.display = (valor === '1' || valor === '2') ? 'block' : 'none';
}

function verificarTipoCargaCaminhao(valor) {
    const divPerigosa = document.getElementById('cond-p2-carga-perigosa');
    if (divPerigosa) divPerigosa.style.display = (valor === '5') ? 'block' : 'none';
}

function verificarViagensCaminhao(valor) {
    const divCidade = document.getElementById('cond-p3-cidade');
    const divEstado = document.getElementById('cond-p3-estado');
    const divEstados = document.getElementById('cond-p3-estados');
    const divInter = document.getElementById('cond-p3-internacional');

    if (divCidade) divCidade.style.display = (valor === '1') ? 'block' : 'none';
    if (divEstado) divEstado.style.display = (valor === '2') ? 'block' : 'none';
    if (divEstados) divEstados.style.display = (valor === '3') ? 'block' : 'none';
    if (divInter) divInter.style.display = (valor === '4') ? 'block' : 'none';
}

function verificarQuemDirigeCaminhao(valor) {
    const divTempoCNH = document.getElementById('cond-p4-tempo-cnh');
    const divQtdMotoristas = document.getElementById('cond-p4-qtd-motoristas');

    if (divTempoCNH) divTempoCNH.style.display = (valor === '2') ? 'block' : 'none';
    if (divQtdMotoristas) divQtdMotoristas.style.display = (valor === '3') ? 'block' : 'none';
}

function verificarRastreadorCaminhao(valor) {
    const divMonit = document.getElementById('cond-p5-monitoramento');
    const divDesejaRastreio = document.getElementById('cond-p5-deseja-rastreio');

    if (divMonit) divMonit.style.display = (valor === '1') ? 'block' : 'none';
    if (divDesejaRastreio) divDesejaRastreio.style.display = (valor === '2') ? 'block' : 'none';
}

function verificarEstacionamentoCaminhao(valor) {
    const divAcesso = document.getElementById('cond-p6-empresa-acesso');
    const divSeguranca = document.getElementById('cond-p6-estac-seguranca');
    const divRuaNoite = document.getElementById('cond-p6-via-noite');
    const divOutroLocal = document.getElementById('cond-p6-outro-local');

    if (divAcesso) divAcesso.style.display = (valor === '2') ? 'block' : 'none';
    if (divSeguranca) divSeguranca.style.display = (valor === '3') ? 'block' : 'none';
    if (divRuaNoite) divRuaNoite.style.display = (valor === '4') ? 'block' : 'none';
    if (divOutroLocal) divOutroLocal.style.display = (valor === '5') ? 'block' : 'none';
}

function verificarAcidenteCaminhao(valor) {
    const divDetalhes = document.getElementById('cond-p7-detalhes-acidente');
    if (divDetalhes) divDetalhes.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarRouboCaminhao(valor) {
    const divDetalhes = document.getElementById('cond-p8-detalhes-roubo');
    if (divDetalhes) divDetalhes.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarTerceirosCaminhao(valor) {
    const divLimite = document.getElementById('cond-p10-limite-terceiros');
    if (divLimite) divLimite.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarAcessoriosCaminhao(valor) {
    const divDetalhe = document.getElementById('cond-p11-detalhe-acessorios');
    if (divDetalhe) divDetalhe.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarFinanciadoCaminhao(valor) {
    const divBanco = document.getElementById('cond-p12-banco');
    if (divBanco) divBanco.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarAnoCaminhao(ano) {
    const divConservacao = document.getElementById('cond-p13-conservacao');
    const anoNum = parseInt(ano, 10);
    const anoAtual = new Date().getFullYear();

    if (divConservacao) {
        divConservacao.style.display = (anoNum && (anoAtual - anoNum >= 10)) ? 'block' : 'none';
    }
}

// 6. LÓGICA CONDICIONAL DO SEGURO DE VIDA
function verificarObjetivoVida(valor) {
    const divFam = document.getElementById('cond-p1-beneficiario-fam');
    const divSit = document.getElementById('cond-p1-sit-pessoal');
    const divFin = document.getElementById('cond-p1-tipo-fin');
    const divOutro = document.getElementById('cond-p1-especificar-outro');

    if (divFam) divFam.style.display = (valor === '1') ? 'block' : 'none';
    if (divSit) divSit.style.display = (valor === '2') ? 'block' : 'none';
    if (divFin) divFin.style.display = (valor === '3') ? 'block' : 'none';
    if (divOutro) divOutro.style.display = (valor === '4') ? 'block' : 'none';
}

function verificarFaixaEtariaVida(valor) {
    const divAdic41 = document.getElementById('cond-p2-adicionais-41');
    const divAnalise = document.getElementById('cond-p2-alerta-analise');

    if (divAdic41) divAdic41.style.display = (valor === '3') ? 'block' : 'none';
    if (divAnalise) divAnalise.style.display = (valor === '4') ? 'block' : 'none';
}

function verificarDependentesVida(valor) {
    const divQtdDep = document.getElementById('cond-p3-qtd-dep');
    const divProtPessoal = document.getElementById('cond-p3-protecao-pessoal');

    if (divQtdDep) divQtdDep.style.display = (valor === '1') ? 'block' : 'none';
    if (divProtPessoal) divProtPessoal.style.display = (valor === '2') ? 'block' : 'none';
}

function verificarMorteVida(valor) {
    const divValorMorte = document.getElementById('cond-p4-valor-morte');
    if (divValorMorte) divValorMorte.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarInvalidezVida(valor) {
    const divTipoInvalidez = document.getElementById('cond-p5-tipo-invalidez');
    if (divTipoInvalidez) divTipoInvalidez.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarDoencasVida(valor) {
    const divTiposDoencas = document.getElementById('cond-p6-tipos-doencas');
    if (divTiposDoencas) divTiposDoencas.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarEsportesVida(valor) {
    const divDetalheEsporte = document.getElementById('cond-p7-detalhe-esporte');
    if (divDetalheEsporte) divDetalheEsporte.style.display = (valor === '1') ? 'block' : 'none';
}

function verificarBeneficiariosVida(valor) {
    const divNumBenef = document.getElementById('cond-p8-num-benef');
    const divMsgPosterior = document.getElementById('cond-p8-msg-posterior');

    if (divNumBenef) divNumBenef.style.display = (valor === '1') ? 'block' : 'none';
    if (divMsgPosterior) divMsgPosterior.style.display = (valor === '3') ? 'block' : 'none';
}

function verificarValorCoberturaVida(valor) {
    const divOutroValor = document.getElementById('cond-p9-outro-valor');
    if (divOutroValor) divOutroValor.style.display = (valor === 'outro') ? 'block' : 'none';
}

function verificarAdicionaisVida(valor) {
    const divQuaisAdic = document.getElementById('cond-p10-quais-adicionais');
    if (divQuaisAdic) divQuaisAdic.style.display = (valor === '1') ? 'block' : 'none';
}

// 6.1 LÓGICA CONDICIONAL DO SEGURO DIVERSOS
function verificarProtecaoDiversos(valor) {
    const divEquip = document.getElementById('cond-p1-equipamento');
    const divObjeto = document.getElementById('cond-p1-objeto');
    const divEvento = document.getElementById('cond-p1-evento');
    const divOutro = document.getElementById('cond-p1-outro-diversos');

    if (divEquip) divEquip.style.display = (valor === '1') ? 'block' : 'none';
    if (divObjeto) divObjeto.style.display = (valor === '2') ? 'block' : 'none';
    if (divEvento) divEvento.style.display = (valor === '3') ? 'block' : 'none';
    if (divOutro) divOutro.style.display = (valor === '4') ? 'block' : 'none';
}

function verificarRiscoDiversos(valor) {
    const divRisco = document.getElementById('cond-p2-especificar-risco');
    if (divRisco) divRisco.style.display = (valor === '4') ? 'block' : 'none';
}

/// 6.2 LÓGICA CONDICIONAL DO SEGURO RESIDENCIAL

function verificarTipoImovelResidencial(valor) {
    const divGaragem = document.getElementById('cond-p1-garagem');
    const divPortaria = document.getElementById('cond-p1-portaria');
    const divOutro = document.getElementById('cond-p1-outro-imovel');

    if (divGaragem) divGaragem.style.display = (valor === '1') ? 'block' : 'none';
    if (divPortaria) divPortaria.style.display = (valor === '2') ? 'block' : 'none';
    if (divOutro) divOutro.style.display = (valor === '3') ? 'block' : 'none';
}

function verificarPosseImovelResidencial(valor) {
    const divAlugado = document.getElementById('cond-p2-alugado');

    if (divAlugado) {
        divAlugado.style.display = (valor === '2') ? 'block' : 'none';
    }
}

function verificarCoberturasResidencial(valor) {
    const divAdicionais = document.getElementById('cond-p3-adicionais');

    if (divAdicionais) {
        divAdicionais.style.display = (valor === '4') ? 'block' : 'none';
    }
}

function verificarBemAltoValorResidencial(valor) {
    const divBemValor = document.getElementById('cond-p4-bem-valor');

    if (divBemValor) {
        divBemValor.style.display = (valor === '1') ? 'block' : 'none';
    }
}


// ============================================
// LÓGICA CONDICIONAL DO SEGURO EMPRESARIAL
// ============================================

function verificarTipoEmpresa(valor) {
    const divComercio = document.getElementById('cond-emp-comercio');
    const divIndustria = document.getElementById('cond-emp-industria');
    const divEscritorio = document.getElementById('cond-emp-escritorio');
    const divServicos = document.getElementById('cond-emp-servicos');
    const divOutro = document.getElementById('cond-emp-outro');

    if (divComercio) {
        divComercio.style.display = valor === '1' ? 'block' : 'none';
    }

    if (divIndustria) {
        divIndustria.style.display = valor === '2' ? 'block' : 'none';
    }

    if (divEscritorio) {
        divEscritorio.style.display = valor === '3' ? 'block' : 'none';
    }

    if (divServicos) {
        divServicos.style.display = valor === '4' ? 'block' : 'none';
    }

    if (divOutro) {
        divOutro.style.display = valor === '5' ? 'block' : 'none';
    }
}

function verificarImovelEmpresa(valor) {
    const divAlugado = document.getElementById('cond-emp-alugado');

    if (divAlugado) {
        divAlugado.style.display = valor === '2' ? 'block' : 'none';
    }
}

function verificarDesejoProtegerEmp(valor) {
    const desejoProteger = document.getElementById('desejo-proteger-emp');

    if (!desejoProteger) {
        return;
    }

    if (valor) {
        limparErroCampo(desejoProteger);
    }
}

function verificarBemAltoValorEmp(valor) {
    const divBemValor = document.getElementById('cond-emp-bem-valor');

    if (divBemValor) {
        divBemValor.style.display = (valor === '1') ? 'block' : 'none';
    }
}

function verificarCoberturasEmpresa(valor) {
    const divAdicionais = document.getElementById('cond-emp-adicionais');

    if (divAdicionais) {
        divAdicionais.style.display = (valor === '4') ? 'block' : 'none';
    }
}

// 7. CARREGAR LISTA DE PROFISSÕES
function carregarProfissoes() {
    const selectProfissao = document.getElementById('profissao-condutor');
    if (!selectProfissao) return;

    selectProfissao.innerHTML = '<option value="">Selecione a profissão...</option>';

    profissoesPreFixadas.sort().forEach(profissao => {
        const option = document.createElement('option');
        option.value = profissao;
        option.textContent = profissao;

        selectProfissao.appendChild(option);
    });
}

// 8. VALIDAÇÃO DE CAMPOS E MENSAGENS DE ERRO
function mostrarErroCampo(campo, mensagem = "Por favor, preencha este campo.") {
    campo.classList.add('erro');
    const inputGroup = campo.closest('.input-group');
    if (!inputGroup) return;

    let msgExistente = inputGroup.querySelector('.erro-mensagem');
    if (!msgExistente) {
        const msgDiv = document.createElement('span');
        msgDiv.className = 'erro-mensagem';
        msgDiv.innerText = mensagem;
        inputGroup.appendChild(msgDiv);
    }
}

function limparErroCampo(campo) {
    campo.classList.remove('erro');
    const inputGroup = campo.closest('.input-group');
    if (inputGroup) {
        const msgExistente = inputGroup.querySelector('.erro-mensagem');
        if (msgExistente) msgExistente.remove();
    }
}

function limparErros() {
    document.querySelectorAll('.input-group').forEach(group => {
        const campo = group.querySelector('input, select, textarea');
        if (campo) campo.classList.remove('erro');
        const msg = group.querySelector('.erro-mensagem');
        if (msg) msg.remove();
    });
}

function validarEtapaAtual() {
    let stepDiv;

    if (etapaAtual === 1 || etapaAtual === 2) {
        stepDiv = document.getElementById(`step-${etapaAtual}`);
    } else {
        let sufixo = 'auto';

        if (tipoSeguroAtual === 'Moto') sufixo = 'moto';
        if (tipoSeguroAtual === 'Caminhão') sufixo = 'caminhao';
        if (tipoSeguroAtual === 'Vida') sufixo = 'vida';
        if (tipoSeguroAtual === 'Diversos') sufixo = 'diversos';
        if (tipoSeguroAtual === 'Residencial') sufixo = 'residencial';
        if (tipoSeguroAtual === 'Empresarial') sufixo = 'empresarial';

        stepDiv = document.getElementById(`step-${etapaAtual}-${sufixo}`);
    }

    if (!stepDiv) return true;

    const campos = stepDiv.querySelectorAll(
        'input[required], select[required], textarea[required]'
    );

    let valido = true;

    campos.forEach(campo => {

        if (
            !campo.disabled &&
            campo.offsetWidth > 0 &&
            campo.offsetHeight > 0
        ) {
            const valor = campo.value.trim();

            // Campo vazio
            if (!valor) {
                mostrarErroCampo(
                    campo,
                    "Por favor, preencha este campo."
                );

                valido = false;
                return;
            }

            // Telefone
            if (
                campo.id === 'telefone' &&
                !validarTelefone(valor)
            ) {
                mostrarErroCampo(
                    campo,
                    "Informe um telefone válido com DDD."
                );

                valido = false;
                return;
            }

            // CPF
            if (
                campo.id === 'outra-cpf' &&
                !validarCPF(valor)
            ) {
                mostrarErroCampo(
                    campo,
                    "Informe um CPF válido."
                );

                valido = false;
                return;
            }

            //Validação de CEP
            if (campo.id === 'cep') {
            const numerosCEP = valor.replace(/\D/g, '');

            if (numerosCEP.length !== 8) {
                mostrarErroCampo(
                    campo,
                    "Informe um CEP válido."
                );

                valido = false;
                return;
            }
        }

            // Campos numéricos
            if (campo.type === 'number') {
                const numero = Number(valor);

                if (campo.min !== '') {
                    const minimo = Number(campo.min);

                    if (numero < minimo) {
                        mostrarErroCampo(
                            campo,
                            `O valor mínimo permitido é ${minimo}.`
                        );

                        valido = false;
                        return;
                    }
                }

                if (campo.max !== '') {
                    const maximo = Number(campo.max);

                    if (numero > maximo) {
                        mostrarErroCampo(
                            campo,
                            `O valor máximo permitido é ${maximo}.`
                        );

                        valido = false;
                        return;
                    }
                }
            }

            limparErroCampo(campo);
        }
    });

    if (!valido) {
        const primeiroErro = stepDiv.querySelector('.erro');

        if (primeiroErro) {
            primeiroErro.focus();
        }
    }

    return valido;
}

// 9. INTEGRAÇÃO COM APIS (FIPE E VIACEP)
function carregarMarcasFIPE() {
    const selectMarca = document.getElementById('marca');
    if (!selectMarca) return;

    fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas')
        .then(res => res.json())
        .then(marcas => {
            selectMarca.innerHTML = '<option value="">Selecione a marca...</option>';
            marcas.forEach(m => {
                selectMarca.innerHTML += `<option value="${m.codigo}">${m.nome}</option>`;
            });
        })
        .catch(err => {
            console.error('Erro ao carregar marcas FIPE:', err);
            selectMarca.innerHTML = '<option value="">Erro ao carregar marcas</option>';
        });
}

function carregarModelos(codigoMarca) {
    const inputModelo = document.getElementById('modelo');
    const dataListModelos = document.getElementById('lista-modelos');

    if (!inputModelo || !dataListModelos) return;

    if (!codigoMarca) {
        inputModelo.disabled = true;
        inputModelo.value = '';
        inputModelo.placeholder = 'Selecione primeiro a marca...';
        dataListModelos.innerHTML = '';
        return;
    }

    inputModelo.value = '';
    inputModelo.placeholder = 'A carregar modelos...';
    inputModelo.disabled = true;

    fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos`)
        .then(res => res.json())
        .then(data => {
            dataListModelos.innerHTML = '';
            data.modelos.forEach(m => {
                const option = document.createElement('option');
                option.value = m.nome;
                dataListModelos.appendChild(option);
            });

            inputModelo.placeholder = 'Digite para pesquisar o modelo...';
            inputModelo.disabled = false;
            inputModelo.focus();
        })
        .catch(err => {
            console.error('Erro ao carregar modelos FIPE:', err);
            inputModelo.placeholder = 'Digite o modelo manualmente...';
            inputModelo.disabled = false;
        });
}

function buscarCEP() {
    const cepInput = document.getElementById('cep');
    if (!cepInput) return;

    let cep = cepInput.value.replace(/\D/g, '');

    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (!data.erro) {
                    const logradouro = document.getElementById('logradouro');
                    const bairro = document.getElementById('bairro');
                    const cidade = document.getElementById('cidade');
                    const uf = document.getElementById('uf');

                    if (logradouro) { logradouro.value = data.logradouro || ''; limparErroCampo(logradouro); }
                    if (bairro) { bairro.value = data.bairro || ''; limparErroCampo(bairro); }
                    if (cidade) { cidade.value = data.localidade || ''; limparErroCampo(cidade); }
                    if (uf && data.uf) { uf.value = data.uf.toUpperCase(); limparErroCampo(uf); }

                    limparErroCampo(cepInput);
                    const numero = document.getElementById('numero');
                    if (numero) numero.focus();
                } else {
                    mostrarErroCampo(cepInput, "CEP não encontrado.");
                }
            })
            .catch(err => {
                console.error('Erro ao buscar CEP:', err);
                mostrarErroCampo(cepInput, "Erro ao buscar CEP.");
            });
    }
}

// Função auxiliar para validar Telefone
function mascaraTelefone(valor) {
    valor = valor.replace(/\D/g, '');

    valor = valor.slice(0, 11);

    if (valor.length <= 10) {
        valor = valor.replace(
            /^(\d{2})(\d)/g,
            '($1) $2'
        );

        valor = valor.replace(
            /(\d{4})(\d)/,
            '$1-$2'
        );
    } else {
        valor = valor.replace(
            /^(\d{2})(\d)/g,
            '($1) $2'
        );

        valor = valor.replace(
            /(\d{5})(\d)/,
            '$1-$2'
        );
    }

    return valor;
}

function validarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');

    return numeros.length === 10 || numeros.length === 11;
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

//Função auxiliar para validar CPF
function mascaraCPF(valor) {
    valor = valor.replace(/\D/g, '');
    valor = valor.slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return valor;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let primeiroDigito = (soma * 10) % 11;

    if (primeiroDigito === 10) {
        primeiroDigito = 0;
    }

    if (primeiroDigito !== Number(cpf[9])) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    let segundoDigito = (soma * 10) % 11;

    if (segundoDigito === 10) {
        segundoDigito = 0;
    }

    return segundoDigito === Number(cpf[10]);
}

//Macara para CEP
function mascaraCEP(valor) {
    valor = valor.replace(/\D/g, '');
    valor = valor.slice(0, 8);

    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');

    return valor;
}

//Mascara Moeda
function mascaraMoeda(valor) {
    valor = valor.replace(/\D/g, '');

    if (!valor) return '';

    const numero = Number(valor) / 100;

    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Função auxiliar para validar e-mail
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


// 10. ENVIO FINAL COM ISOLAMENTO TOTAL POR TIPO DE SEGURO
function enviarFormulario() {
    if (!validarEtapaAtual()) return;

    // Validação do e-mail
    const inputEmail = document.getElementById('email') || document.querySelector('input[type="email"]');

    if (inputEmail && inputEmail.value) {
        if (!validarEmail(inputEmail.value)) {
            alert('Por favor, insira um e-mail válido antes de enviar a cotação.');
            inputEmail.focus();
            return;
        }
    }

    const tipoAtual = tipoSeguroAtual ? tipoSeguroAtual.toLowerCase().trim() : '';

    // Identifica EXATAMENTE o fluxo do seguro selecionado
    const mapaFluxos = {
        'auto': 'fluxo-auto',
        'moto': 'fluxo-moto',
        'caminhão': 'fluxo-caminhao',
        'caminhao': 'fluxo-caminhao',
        'vida': 'fluxo-vida',
        'diversos': 'fluxo-diversos',
        'residencial': 'fluxo-residencial',
        'empresarial': 'fluxo-empresarial'
    };

    const idFluxo = mapaFluxos[tipoAtual];
    const fluxoSelecionado = idFluxo ? document.getElementById(idFluxo) : null;

    if (!fluxoSelecionado) {
        console.error('Fluxo do seguro não encontrado:', tipoSeguroAtual);
        alert('Não foi possível identificar o tipo de seguro. Atualize a página e tente novamente.');
        return;
    }

    // Os dados abaixo são comuns a todos os seguros
    const etapaCliente = document.getElementById('step-1');
    const etapaEndereco = document.getElementById('step-2');

    // O botão de envio fica dentro do fluxo específico
    const botoes = fluxoSelecionado.querySelectorAll('button, .btn');

    let botaoEnviar = null;

    botoes.forEach(btn => {
        const texto = btn.innerText.toUpperCase();

        if (texto.includes('ENVIAR') || texto.includes('COTAÇÃO')) {
            botaoEnviar = btn;
        }
    });

    let textoOriginalBotao = "ENVIAR COTAÇÃO";

    if (botaoEnviar) {
        textoOriginalBotao = botaoEnviar.innerText;
        botaoEnviar.disabled = true;
        botaoEnviar.innerText = "Enviando...";
        botaoEnviar.style.opacity = "0.7";
        botaoEnviar.style.cursor = "not-allowed";
    }

    // ---------------------------------------------------------
    // COLETA DOS CAMPOS
    // ---------------------------------------------------------

    let dadosResumo = `Nova Cotação de Seguro: ${tipoSeguroAtual ? tipoSeguroAtual.toUpperCase() : 'GERAL'}\n\nDetalhes do Cliente / Formulário:\n`;

    // Função responsável por coletar os campos de um determinado bloco
    function coletarCampos(container) {

        if (!container) return;

        const campos = container.querySelectorAll('input, select, textarea');

        campos.forEach(campo => {

            // Ignora campos que não devem ser enviados
            if (campo.type === 'hidden' ||
                campo.type === 'submit' ||
                campo.type === 'button') {
                return;
            }

            // Ignora campos desabilitados
            if (campo.disabled) return;

            // Radio e checkbox:
            // só interessa o que estiver marcado
            if (campo.type === 'radio' || campo.type === 'checkbox') {
                if (!campo.checked) return;
            } else {
                if (!campo.value || campo.value.trim() === '') return;
            }

            // Ignora campos condicionais que estejam ocultos
            const elementoCondicional = campo.closest('[id^="cond-"], #campos-outra-pessoa');

            if (elementoCondicional) {
                const estilo = window.getComputedStyle(elementoCondicional);

                if (estilo.display === 'none') {
                    return;
                }
            }

            // Descobre o nome/label do campo
            let rotulo = campo.name || campo.id || 'Campo';

            const label =
                document.querySelector(`label[for="${campo.id}"]`) ||
                campo.closest('label');

            if (label) {
                rotulo = label.innerText.replace(':', '').trim();
            } else if (campo.placeholder) {
                rotulo = campo.placeholder;
            }

            // Valor que será enviado
            let valorFormatado = campo.value;

            // SELECT: pega o texto da opção em vez do value
            if (campo.tagName.toLowerCase() === 'select') {

                if (
                    campo.selectedIndex >= 0 &&
                    campo.options[campo.selectedIndex]
                ) {
                    const textoOpcao = campo.options[campo.selectedIndex].text;

                    if (
                        textoOpcao &&
                        !textoOpcao.toLowerCase().includes('selecione')
                    ) {
                        valorFormatado = textoOpcao;
                    }
                }
            }

            // RADIO / CHECKBOX
            if (campo.type === 'radio' || campo.type === 'checkbox') {

                let textoOpcao = campo.value;

                const labelRadio =
                    document.querySelector(`label[for="${campo.id}"]`) ||
                    campo.closest('label');

                if (labelRadio) {
                    textoOpcao = labelRadio.innerText.trim();
                }

                dadosResumo += `- ${rotulo}: ${textoOpcao}\n`;

            } else {

                dadosResumo += `- ${rotulo}: ${valorFormatado}\n`;
            }
        });
    }

    // ---------------------------------------------------------
    // COLETA APENAS OS DADOS COMUNS
    // ---------------------------------------------------------

    coletarCampos(etapaCliente);
    coletarCampos(etapaEndereco);

    // ---------------------------------------------------------
    // COLETA SOMENTE O FLUXO DO SEGURO ESCOLHIDO
    // ---------------------------------------------------------

    coletarCampos(fluxoSelecionado);

    // ---------------------------------------------------------
    // PARÂMETROS PARA O EMAILJS
    // ---------------------------------------------------------

    const parametrosEnvio = {
        tipo_seguro: tipoSeguroAtual ? tipoSeguroAtual.toUpperCase() : 'GERAL',
        mensagem_completa: dadosResumo,
        data_envio: new Date().toLocaleString()
    };

    // ---------------------------------------------------------
    // ENVIO
    // ---------------------------------------------------------

emailjs.send('service_h6v6mgg', 'template_d9f3clv', parametrosEnvio)
    .then((response) => {

        console.log('E-mail enviado com sucesso!', response);

        // 1. Volta o botão ao normal
        if (botaoEnviar) {
            botaoEnviar.disabled = false;
            botaoEnviar.innerText = textoOriginalBotao;
            botaoEnviar.style.opacity = "1";
            botaoEnviar.style.cursor = "pointer";
        }

        // 2. Fecha o formulário
        fecharModal();

        // 3. Mostra o popup bonito de sucesso
        mostrarPopupFeedback(
            'Cotação enviada!',
            'Recebemos suas informações com sucesso. Em breve entraremos em contato.',
            'sucesso'
        );

    }, (error) => {

        console.error('Erro ao enviar e-mail:', error);

        // Volta o botão ao normal também em caso de erro
        if (botaoEnviar) {
            botaoEnviar.disabled = false;
            botaoEnviar.innerText = textoOriginalBotao;
            botaoEnviar.style.opacity = "1";
            botaoEnviar.style.cursor = "pointer";
        }

        mostrarPopupFeedback(
            'Não foi possível enviar',
            'Ocorreu um erro ao enviar sua cotação. Por favor, tente novamente.',
            'erro'
        );
    });
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('input, select, textarea').forEach(campo => {
        campo.addEventListener('input', () => limparErroCampo(campo));
        campo.addEventListener('change', () => limparErroCampo(campo));
    });

    // Máscara de telefone
    const telefoneInput = document.getElementById('telefone');

    if (telefoneInput) {
        telefoneInput.addEventListener('input', () => {
            telefoneInput.value = mascaraTelefone(telefoneInput.value);
        });
    }

    // Máscara de CPF
    const cpfInput = document.getElementById('outra-cpf');

    if (cpfInput) {
        cpfInput.addEventListener('input', () => {
            cpfInput.value = mascaraCPF(cpfInput.value);
        });
    }

    // Busca de CEP
    const cepInput = document.getElementById('cep');

    if (cepInput) {
        cepInput.addEventListener('input', () => {
            cepInput.value = mascaraCEP(cepInput.value);
        });

        cepInput.addEventListener('blur', buscarCEP);
    }

    //Mascara moeda
    const valorCaminhaoInput = document.getElementById('p14-valor-caminhao');

    if (valorCaminhaoInput) {
        valorCaminhaoInput.addEventListener('input', () => {
            valorCaminhaoInput.value = mascaraMoeda(valorCaminhaoInput.value);
        });
    }

    const valorAcessoriosInput = document.getElementById('p11-valor-aproximado');

    if (valorAcessoriosInput) {
        valorAcessoriosInput.addEventListener('input', () => {
            valorAcessoriosInput.value = mascaraMoeda(valorAcessoriosInput.value);
        });
    }

    //Vida
    const valorVidaInput = document.getElementById('p9-especificar-valor');

    if (valorVidaInput) {
        valorVidaInput.addEventListener('input', () => {
            valorVidaInput.value = mascaraMoeda(valorVidaInput.value);
        });
    }

    const valorMorteInput = document.getElementById('p4-capital-morte');

    if (valorMorteInput) {
        valorMorteInput.addEventListener('input', () => {
            valorMorteInput.value = mascaraMoeda(valorMorteInput.value);
        });
    }

    //Residencial
    const valorBemInput = document.getElementById('valor-bem');

    if (valorBemInput) {
        valorBemInput.addEventListener('input', () => {
            valorBemInput.value = mascaraMoeda(valorBemInput.value);
        });
    }

    //Empresarial
    const valorEquipamentoInput = document.getElementById('valor-equipamento');

    if (valorEquipamentoInput) {
        valorEquipamentoInput.addEventListener('input', () => {
            valorEquipamentoInput.value = mascaraMoeda(valorEquipamentoInput.value);
        });
    }

    carregarMarcasFIPE();
    carregarProfissoes();
});

function mostrarPopupFeedback(titulo, mensagem, tipo = 'sucesso') {

    const overlay = document.getElementById('popup-feedback-overlay');
    const tituloPopup = document.getElementById('popup-feedback-title');
    const mensagemPopup = document.getElementById('popup-feedback-message');
    const iconePopup = document.getElementById('popup-feedback-icon');

    if (!overlay || !tituloPopup || !mensagemPopup || !iconePopup) {
        return;
    }

    overlay.classList.remove('erro', 'aviso');

    if (tipo === 'erro') {

        overlay.classList.add('erro');
        iconePopup.textContent = '×';

    } else if (tipo === 'aviso') {

        overlay.classList.add('aviso');
        iconePopup.textContent = '!';

    } else {

        iconePopup.textContent = '✓';
    }

    tituloPopup.textContent = titulo;
    mensagemPopup.textContent = mensagem;

    overlay.classList.add('show');
}


function fecharPopupFeedback() {

    const overlay = document.getElementById('popup-feedback-overlay');

    if (overlay) {
        overlay.classList.remove('show');
    }
}