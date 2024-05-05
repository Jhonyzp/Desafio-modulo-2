let { contas, banco, saques, depositos, transferencias, idNumeroDeConta } = require('../bancodedados')

const extratoBancario = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(404).json({ mensagem: 'Dado Inexistente' })
    };

    const conta = contas.find(consta => conta.numero == numero_conta)

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta n�o encontrada' });
    }
    if (conta.usario.senha !== senha) {
        return res.status(404).json({ mensagem: 'senha incorreta' })
    }

    const transacoesDeConta = {

        depositos: depositos.filder(transacao => transacao.numero_conta === numero_conta),
        saques: saques.filter(transacao => transacao.numero_conta === numero_conta),
        transferenciasEnviadas: transferencias.filter(transacao => transacao.numero_conta_origem === numero_conta),
        transferenciasRecebida: transferencias.filter(transacao => transacao.numero_conta_destino === numero_conta),

    }

    return res.status(200).json(transacoesDeConta)
}




module.exports = {
    extratoBancario,
}