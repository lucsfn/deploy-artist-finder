let idUserLogged = 0;

// Função para obter o usuário logado
function obterUsuarioLogado() {
    return fetch('http://localhost:3000/usuarios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter dados dos usuários');
            }
            return response.json();
        })
        .then(data => {
            const usuarioLogado = data.find(usuario => usuario.loggedIn);
            if (!usuarioLogado) {
                throw new Error('Nenhum usuário logado encontrado');
            }
            idUserLogged = usuarioLogado.id;
            return usuarioLogado;
        });
}

// Função para carregar e atualizar os dados do usuário no formulário e no perfil HTML
function carregarDadosUsuario() {
    obterUsuarioLogado()
        .then(usuarioLogado => {
            document.getElementById('editName').value = usuarioLogado.nome;
            document.getElementById('editAge').value = usuarioLogado.idade;
            document.getElementById('editUsername').value = usuarioLogado.username;
            document.getElementById('editProfession').value = usuarioLogado.atuacao;
            document.getElementById('editState').value = usuarioLogado.estado;
            document.getElementById('editInstitution').value = usuarioLogado.instituicao;
            document.getElementById('editAvailability').value = usuarioLogado.disponibilidade;

            // Atualiza os dados no perfil do usuário no HTML
            document.getElementById('user-name').textContent = usuarioLogado.nome;
            document.getElementById('user-age').textContent = `${usuarioLogado.idade} anos`;
            document.getElementById('username').textContent = usuarioLogado.username;
            document.getElementById('user-profession').textContent = usuarioLogado.atuacao;
            document.getElementById('user-state').textContent = usuarioLogado.estado;
            document.getElementById('user-institution').textContent = usuarioLogado.instituicao;
            document.getElementById('user-availability').textContent = usuarioLogado.disponibilidade;
            // Pode adicionar a atualização da foto de perfil também, se houver um atributo para isso
            // document.getElementById('user-photo').src = usuarioLogado.foto;
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error));
}

// Função para salvar mudanças no usuário
function salvarMudancasUsuario() {
    var nome = document.getElementById('editName').value;
    var idade = document.getElementById('editAge').value;
    var username = document.getElementById('editUsername').value;
    var profissao = document.getElementById('editProfession').value;
    var estado = document.getElementById('editState').value;
    var instituicao = document.getElementById('editInstitution').value;
    var disponibilidade = document.getElementById('editAvailability').value;

    obterUsuarioLogado()
        .then(usuarioLogado => {
            var dadosAtualizados = {
                ...usuarioLogado,
                nome: nome || usuarioLogado.nome,
                idade: idade || usuarioLogado.idade,
                username: username || usuarioLogado.username,
                atuacao: profissao || usuarioLogado.atuacao,
                estado: estado || usuarioLogado.estado,
                instituicao: instituicao || usuarioLogado.instituicao,
                disponibilidade: disponibilidade || usuarioLogado.disponibilidade
            };

            return fetch(`http://localhost:3000/usuarios/${idUserLogged}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosAtualizados)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar dados do usuário');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados atualizados com sucesso:', data);
            // Atualiza os dados exibidos no perfil após o salvamento
            carregarDadosUsuario();
            var modal = document.getElementById('editModal');
            var bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.hide();
        })
        .catch(error => console.error('Erro ao salvar dados:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    carregarDadosUsuario();
});

document.getElementById('saveChangesButton').addEventListener('click', function() {
    salvarMudancasUsuario();
});
