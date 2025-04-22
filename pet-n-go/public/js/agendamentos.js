async function carregarNomeUsuario() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/usuario', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.ok) {
            const data = await res.json();
            document.querySelector('.bemvindo').innerText = `Olá, ${data.nome}!`;
        } else {
            console.log('Erro ao buscar nome do usuário');
        }
    } catch (err) {
        console.error(err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    carregarNomeUsuario();
    const token = localStorage.getItem('token')
    
    try {
        const res = await fetch('/api/agendamentos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (res.ok) {
            const agendamentos = await res.json()
            const container = document.querySelector('.agendamentos')

            if (agendamentos.length === 0) {
                container.innerHTML = `
                <div class="semAgenda">
                <p>Ops! Parece que você ainda não possui nenhum agendamento...</p>
                <br>
                <p><i>Faça um agendamento clicando no ícone no canto superior!</i></p>
                </div>
                `
                return
            }

            agendamentos.forEach(ag => {
                const div = document.createElement('div')
                div.classList.add('cardAgendamento')
                div.setAttribute('data-id', ag.idAgendamento)
                div.innerHTML = `
                <div class="agendamento-todo">
                    <div class="agendamento-info">
                        <img src="${ag.fotoPet || 'assets/images/defaultPet.png'}" class="pet-foto" />
                        <div class="dados-pet">
                            <p class="nome-pet">${ag.nomePet}</p>
                            <p class="servico">${ag.servico}</p>
                        </div>
                    </div>
                    <div class="data-acoes">
                    <div class="agendamento-data">
                        <p class="data"><strong>${new Date(ag.data_agendada).toLocaleDateString()}</strong></p>
                        <p class="hora">${ag.horario.slice(0, 5)}</p>
                    </div>
                    <div class="acoes">
                            <button class="editar"><img src="assets/images/Pen Squared.png" /></button>
                            <button class="cancelar"><img src="assets/images/Cancel.png" /></button>
                        </div>
                    </div>
                </div>
                `
                container.appendChild(div)
            })

            document.querySelectorAll('.cancelar').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const card = e.currentTarget.closest('.cardAgendamento')
                    const nomePet = card.querySelector('.nome-pet').innerText
                    const id = card.getAttribute('data-id')
                    const token = localStorage.getItem('token')
            
                    if (confirm(`Deseja mesmo cancelar o agendamento de ${nomePet}?`)) {
                        try {
                            const res = await fetch(`/api/agendamentos/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            })
            
                            if (res.ok) {
                                alert('Agendamento cancelado com sucesso!')
                                location.reload()
                            } else {
                                alert('Erro ao cancelar agendamento.')
                            }
                        } catch (err) {
                            console.error(err)
                            alert('Erro ao se comunicar com o servidor.')
                        }
                    }
                })
            })

            document.querySelectorAll('.editar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = e.currentTarget.closest('.cardAgendamento')
            
                    const id = card.getAttribute('data-id')
                    const nomePet = card.querySelector('.nome-pet').innerText
                    const servico = card.querySelector('.servico').innerText
                    const data = card.querySelector('.data').innerText.split('/').reverse().join('-')
                    const hora = card.querySelector('.hora').innerText
            
                    const dadosAgendamento = {
                        id,
                        nomePet,
                        servico,
                        data,
                        hora
                    }
            
                    localStorage.setItem('agendamentoEditar', JSON.stringify(dadosAgendamento))
                    window.location.href = 'agendar.html'
                })
            })
            
        } else {
            document.querySelector('.agendamentos').innerText = 'Erro ao carregar agendamentos.'
        }
    } catch (err) {
        console.error(err)
        document.querySelector('.agendamentos').innerText = 'Erro inesperado.'
    }
})
