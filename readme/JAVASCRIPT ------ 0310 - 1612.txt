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

    if (fluxoAuto) fluxoAuto.style.display = 'none';
    if (fluxoMoto) fluxoMoto.style.display = 'none';
    if (fluxoCaminhao) fluxoCaminhao.style.display = 'none';
    if (fluxoVida) fluxoVida.style.display = 'none';

    // Mostrar o fluxo correto
    if (servico === 'Moto' && fluxoMoto) {
        fluxoMoto.style.display = 'block';
    } else if (servico === 'Caminhão' && fluxoCaminhao) {
        fluxoCaminhao.style.display = 'block';
    } else if (servico === 'Vida' && fluxoVida) {
        fluxoVida.style.display = 'block';
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
    if (modal) modal.style.display = 'none';
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

        const step = document.getElementById(`step-${numero}-${sufixo}`);
        if (step) {
            step.classList.add('active');
            step.style.display = 'block';
        }
    }
}

function proximaEtapa() {
    if (validarEtapaAtual()) {
        const maxEtapas = 5;
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
    const divAcesso = document.getElementById('cond-p6-empresa-accesso');
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

function verificarCoberturasCaminhao(valor) {}

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

// 6. LÓGICA CONDICIONAL DO SEGURO DE VIDA (11 PERGUNTAS)
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

// 7. CARREGAR LISTA DE PROFISSÕES
function carregarProfissoes() {
    const dataList = document.getElementById('lista-profissoes');
    if (!dataList) return;

    dataList.innerHTML = '';
    profissoesPreFixadas.sort().forEach(profissao => {
        const option = document.createElement('option');
        option.value = profissao;
        dataList.appendChild(option);
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

        stepDiv = document.getElementById(`step-${etapaAtual}-${sufixo}`);
    }

    if (!stepDiv) return true;

    const campos = stepDiv.querySelectorAll('input[required], select[required], textarea[required]');
    let valido = true;

    campos.forEach(campo => {
        if (campo.offsetWidth > 0 && campo.offsetHeight > 0) {
            if (!campo.value || campo.value.trim() === '') {
                mostrarErroCampo(campo, "Por favor, preencha este campo.");
                valido = false;
            } else {
                limparErroCampo(campo);
            }
        }
    });

    if (!valido) {
        const primeiroErro = stepDiv.querySelector('.erro');
        if (primeiroErro) primeiroErro.focus();
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

// 10. ENVIO FINAL E CARREGAMENTO INICIAL
function enviarFormulario() {
    if (validarEtapaAtual()) {
        alert('Cotação enviada com sucesso!');
        fecharModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input, select, textarea').forEach(campo => {
        campo.addEventListener('input', () => limparErroCampo(campo));
        campo.addEventListener('change', () => limparErroCampo(campo));
    });

    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('blur', buscarCEP);
    }

    carregarMarcasFIPE();
    carregarProfissoes();
});