import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveMenu from '../../components/ADMResponsiveMenu';
import RenderMenu from '../../components/Render_Menu';
import '../../static/CadastroUsuario.css';
import AdminRole from '../../hocs/Hoc_Admin';

const CadastroUsuario: React.FC = () => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [nivelAcesso, setNivelAcesso] = useState('');
    const [lider, setLider] = useState(''); 
    const [lideres, setLideres] = useState([]); 

    // Formatar CPF
    const formatCpf = (value: string) => {
        const onlyDigits = value.replace(/\D/g, '');
        if (onlyDigits.length <= 11) {
            return onlyDigits
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        return value;
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatCpf(e.target.value);
        if (formattedValue.length <= 14) {
            setCpf(formattedValue);
        }
    };

    // Buscar líderes da API
    useEffect(() => {
        if (nivelAcesso === 'Liderado') {
            // Buscar todos os líderes da API quando o cargo selecionado for "Liderado"
            axios.get(`${process.env.REACT_APP_API_URL}/api/lideres`)
                .then(response => setLideres(response.data))
                .catch(error => console.error("Erro ao buscar líderes:", error));
        }
    }, [nivelAcesso]);

    // Função para enviar o formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (senha !== confirmaSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        const usuario = { nome, cpf, email, senha, cargo: nivelAcesso, liderId: nivelAcesso === 'Liderado' ? lider : null };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/usuarios`, usuario);
            if (response.status === 201) {
                alert("Usuário cadastrado com sucesso!");
                handleClear();
            }
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            alert("Erro ao cadastrar usuário. Tente novamente.");
        }
    };

    const handleClear = () => {
        setNome('');
        setCpf('');
        setEmail('');
        setSenha('');
        setConfirmaSenha('');
        setNivelAcesso('');
        setLider(''); 
    };

    return (
        <div className="form-container2">
            <RenderMenu />
            <h2>Cadastro de Usuário</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row2">
                    <div className="form-column2">
                        <div className="form-group2">
                            <label htmlFor="nome">Nome:</label>
                            <input
                                type="text"
                                id="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group2">
                            <label htmlFor="cpf">CPF:</label>
                            <input
                                type="text"
                                id="cpf"
                                value={cpf}
                                onChange={handleCpfChange}
                                required
                            />
                        </div>
                        <div className="form-group2">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-column2" style={{ marginTop: '1.1%' }}>
                        <div className="form-group2">
                            <label htmlFor="nivelAcesso">Nível de Acesso:</label>
                            <select
                                id="nivelAcesso"
                                value={nivelAcesso}
                                onChange={(e) => setNivelAcesso(e.target.value)}
                                required
                                style={{ marginLeft: '4%', width: '80%' }}
                            >
                                <option value="" disabled hidden>Defina o nível de acesso</option>
                                <option value="Líder">Líder</option>
                                <option value="Liderado">Liderado</option>
                            </select>
                        </div>

                        {nivelAcesso === 'Liderado' && (
                            <div className="form-group2">
                                <label htmlFor="lider">Selecione o Líder:</label>
                                <select
                                    id="lider"
                                    value={lider}
                                    onChange={(e) => setLider(e.target.value)}
                                    required
                                    style={{ marginLeft: '4%', width: '80%', marginBottom: '3%' }}
                                >
                                    <option value="" disabled hidden>Escolha um líder</option>
                                    {lideres.map((lider: any) => (
                                        <option key={lider.id} value={lider.id}>
                                            {lider.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="form-group2">
                            <label htmlFor="senha">Digite uma senha:</label>
                            <input
                                type="password"
                                id="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group2">
                            <label htmlFor="confirmaSenha">Confirme sua senha:</label>
                            <input
                                type="password"
                                id="confirmaSenha"
                                value={confirmaSenha}
                                onChange={(e) => setConfirmaSenha(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-buttons2">
                    <button type="button" className="btn-clear" onClick={handleClear}>
                        Limpar
                    </button>
                    <button type="submit" className="btn-submit">
                        Cadastrar Usuário
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminRole(CadastroUsuario);
