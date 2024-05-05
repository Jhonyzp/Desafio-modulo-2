const bancoDeDados = require('../bancodedados');
let numeroContaCadastrada = 1;


const listarContas = (req, res) => {
    return res.status(200).json(bancoDeDados.contas);
}

const cadastrarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const novaConta = {
        numero: String(numeroContaCadastrada),
        saldo: 0,
        usuario: {
            nome: nome,
            cpf: cpf,
            data_nascimento: data_nascimento,
            telefone: telefone,
            email: email,
            senha: senha,
        }
    }

    bancoDeDados.contas.push(novaConta);

    numeroContaCadastrada++
    return res.status(201).send();
}


const excluirConta = (req, res) => {
    const { numeroConta } = req.params;


    const indexConta = bancoDeDados.contas.findIndex(conta => conta.numero === numeroConta);

    const saldoContaEncontrada = bancoDeDados.contas[indexConta].saldo;

    if (saldoContaEncontrada === 0) {

        bancoDeDados.contas.splice(indexConta, 1);
        return res.status(200).send();

    }


    return res.status(400).json({
        "mensagem": "A conta só pode ser removida se o saldo for zero!"
    });


}

const atualizarDadosUsuarios = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const usuarioProcurarCpfeEamil = bancoDeDados.contas.findIndex(conta => conta.numero === numeroConta);


    const cpfContaEncontrada = bancoDeDados.contas[usuarioProcurarCpfeEamil].usuario.cpf;

    if (cpfContaEncontrada !== cpf) {

        const encontrarCpf = bancoDeDados.contas.some(conta => conta.usuario.cpf === cpf);

        if (encontrarCpf) {
            return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf informado!' });
        }


    }

    const emailContaEncontrada = bancoDeDados.contas[usuarioProcurarCpfeEamil].usuario.email;
    if (emailContaEncontrada !== email) {

        const emailContaEncontrada = bancoDeDados.contas.some(conta => conta.usuario.email === email);

        if (emailContaEncontrada) {
            return res.status(400).json({ mensagem: 'Já existe uma conta com o e-mail informado!' });
        }


    }

    const usuarioAtualizar = bancoDeDados.contas.find(conta => conta.numero === numeroConta);

    usuarioAtualizar.usuario.nome = nome;
    usuarioAtualizar.usuario.cpf = cpf;
    usuarioAtualizar.usuario.data_nascimento = data_nascimento;
    usuarioAtualizar.usuario.telefone = telefone;
    usuarioAtualizar.usuario.email = email;
    usuarioAtualizar.usuario.senha = senha;

    return res.status(203).send();

}

const obterExtrato = (req, res) => {
    const { numero_conta } = req.query;


    const dadosParaExtrato = {
        depositos: bancoDeDados.depositos.filter((conta) => conta.numero_conta === numero_conta),
        saques: bancoDeDados.saques.filter((conta) => conta.numero_conta === numero_conta),
        transferenciasEnviadas: bancoDeDados.transferencias.filter((conta) => conta.numero_conta_origem === numero_conta),
        transferenciasRecebidas: bancoDeDados.transferencias.filter((conta) => conta.numero_conta_destino === numero_conta),
    };


    return res.status(200).json(dadosParaExtrato)

}

const obterSaldoConta = (req, res) => {
    const { numero_conta, senha } = req.query;

    const contaSaldo = bancoDeDados.contas.findIndex(conta => conta.numero === numero_conta);

    const saldoContaEncontrada = bancoDeDados.contas[contaSaldo].saldo;

    return res.status(200).json(saldoContaEncontrada)

}


module.exports = {
    listarContas,
    cadastrarConta,
    excluirConta,
    atualizarDadosUsuarios,
    obterExtrato,
    obterSaldoConta

}