let { contas, banco, saques, depositos, transferencias, idNumeroDeConta } = require('../bancodedados')

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!valor || !numero_conta) {
        return res.status(404).json({ mensagem: 'Dados Inexistentes' })
    };
    if (Number(valor) <= 0) {
        return res.status(404).json({ mensagem: 'N�o � permitido valores menores que 0' })
    };

    let contaBancaria = contas.find(conta => conta.numero == numero_conta);
    contaBancaria.saldo += valor;

    const extratoDeDeposito = {
        "data": new Date().toString(),
        "numero_conta": numero_conta,
        "valor": valor
    };

    depositos.push(extratoDeDeposito);
    return res.status(202).send()
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!valor || !numero_conta || !senha) {
        return res.status(404).json({ mensagem: 'Dados Inexistentes' })
    };
    const data = new Date().toLocaleString();

    let saqueBancario = contas.find(conta => conta.numero == numero_conta);
    saqueBancario.saldo -= valor;

    const extratoSaque = {
        "data": data,
        "numero_conta": numero_conta,
        "valor": valor
    };

    saques.push(extratoSaque);
    return res.status(202).send()
}

const tranferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    let contaOrigem = contas.find(conta => conta.numero == numero_conta_origem);
    contaOrigem.saldo -= valor;

    let contaDestino = contas.find(conta => conta.numero == numero_conta_destino);
    contaDestino.saldo += valor;

    const novaTranferencia = {
        "data": new Date().toString(),
        "numero_conta_origem": numero_conta_origem,
        "numero_conta_destino": numero_conta_destino,
        "valor": valor
    };

    transferencias.push(novaTranferencia);
    return res.status(202).send()
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'Dados Obrigatorios ' })
    };
    let conta = contas.find(conta => conta.numero == Number(numero_conta));

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta n�o encontrada' });
    };

    if (conta.usuario.senha !== senha) {
        return res.status(401).json({ Mensagem: 'senha incorreta' });
    }
    return res.status(200).json({ saldo: conta.saldo });

}








module.exports = {
    depositar,
    sacar,
    tranferir,
    saldo

}