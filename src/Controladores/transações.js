const bancoDeDados = require('../bancodedados');

const novoDeposito = (req, res) => {
    const { valor, numero_conta } = req.body;

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'Valor do deposito deve ser maior que R$ 0,00' })
    }

    const incluirDeposito = {

        data: new Date(),
        numero_conta,
        valor,

    }

    bancoDeDados.depositos.push(incluirDeposito);

    const usuarioIncluirSaldo = bancoDeDados.contas.find(conta => conta.numero === numero_conta);

    usuarioIncluirSaldo.saldo += valor;

    return res.status(201).send();


}

const novoSaque = (req, res) => {
    const { valor, numero_conta, senha } = req.body;

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'Valor do saque deve ser maior que R$ 0,00' })
    }

    const contaVerificarSaldo = bancoDeDados.contas.findIndex(conta => conta.numero === numero_conta);

    const saldoConta = bancoDeDados.contas[contaVerificarSaldo].saldo;

    if (saldoConta <= 0) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" });
    }

    const incluirSaque = {

        data: new Date(),
        numero_conta,
        valor,

    }

    bancoDeDados.saques.push(incluirSaque);

    const usuarioIncluirSaldo = bancoDeDados.contas.find(conta => conta.numero === numero_conta);

    usuarioIncluirSaldo.saldo -= valor;

    return res.status(201).send();


}

const novaTransferencia = (req, res) => {
    const { valor, numero_conta_origem, numero_conta_destino, senha } = req.body;


    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'Valor da transferência deve ser maior que R$ 0,00' })
    }

    const contaOrigemVerificarSaldo = bancoDeDados.contas.findIndex(conta => conta.numero === numero_conta_origem);

    const saldoContaOrigem = bancoDeDados.contas[contaOrigemVerificarSaldo].saldo;

    if (saldoContaOrigem <= 0) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" });
    }

    const incluirTransferencia = {

        data: new Date(),
        numero_conta_origem,
        numero_conta_destino,
        valor,

    }

    bancoDeDados.transferencias.push(incluirTransferencia);

    const contaOrigem = bancoDeDados.contas.find(conta => conta.numero === numero_conta_origem);

    contaOrigem.saldo -= valor;

    const contaDestino = bancoDeDados.contas.find(conta => conta.numero === numero_conta_destino);

    contaDestino.saldo += valor;



    return res.status(201).send();


}



module.exports = {
    novoDeposito,
    novoSaque,
    novaTransferencia,
}