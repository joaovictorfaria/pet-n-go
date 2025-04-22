async function handleSubmitAgendamento(e) {
    e.preventDefault()

    const nomePet = document.querySelector('.nome input').value
    const servico = document.querySelector('.servico select').value
    const data = document.querySelector('.data input').value
    const hora = document.querySelector('.hora select').value
    const token = localStorage.getItem('token')
    const editarData = localStorage.getItem('agendamentoEditar')

    if (!nomePet || !servico || !data || !hora) {
        alert('Preencha todos os campos!')
        return
    }

    if (editarData) {
        // Edição de agendamento
        const { id } = JSON.parse(editarData)

        // Se a imagem foi alterada, inclua o ID da imagem na requisição
        const res = await fetch(`/api/agendamentos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nomePet,
                servico,
                data,
                hora,
                fkImagem: idImagem // Envia o ID da imagem se for uma edição
            })
        })

        if (res.ok) {
            alert('Agendamento editado com sucesso!')
            localStorage.removeItem('agendamentoEditar')
            window.location.href = 'agendamentos.html'
        } else {
            alert('Erro ao editar agendamento')
        }
    } else {
        // Criação de agendamento
        if (!idImagem) {
            alert('Por favor, envie uma imagem do pet antes de agendar!')
            return
        }

        const res = await fetch('api/agendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nomePet, servico, data, hora, fkImagem: idImagem })
        })

        if (res.ok) {
            alert('Agendamento realizado com sucesso!')
            window.location.href = 'agendamentos.html'
        } else {
            const msg = await res.text()
            alert('Erro: ' + msg)
        }
    }
}

// Preview da imagem
const inputFoto = document.getElementById('fotoPetInput')
const previewImagem = document.getElementById('previewImagem')

inputFoto.addEventListener('change', () => {
    const file = inputFoto.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            previewImagem.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
})

// Upload da imagem
document.querySelector('.btnUpload').addEventListener('click', async (e) => {
    e.preventDefault()

    const fileInput = document.getElementById('fotoPetInput')
    const file = fileInput.files[0]

    if (!file) {
        alert('Selecione uma imagem primeiro!')
        return
    }

    const formData = new FormData()
    formData.append('foto', file)

    const token = localStorage.getItem('token')

    try {
        const res = await fetch('api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })

        if (res.ok) {
            const data = await res.json()
            idImagem = data.imageId
            document.getElementById('uploadStatus').innerText = 'Imagem enviada com sucesso!'
        } else {
            throw new Error('Erro ao enviar imagem')
        }
    } catch (err) {
        console.error(err)
        document.getElementById('uploadStatus').innerText = 'Erro ao enviar imagem'
    }
})

// Carregar dados para edição e adicionar listener de submit
window.addEventListener('DOMContentLoaded', () => {
    const editarData = localStorage.getItem('agendamentoEditar')

    if (editarData) {
        const dados = JSON.parse(editarData)
        document.querySelector('.nome input').value = dados.nomePet
        document.querySelector('.servico select').value = dados.servico
        document.querySelector('.data input').value = dados.data
        document.querySelector('.hora select').value = dados.hora

        // Se já tiver uma imagem associada ao agendamento, defina o ID da imagem
        idImagem = dados.fkImagem || null

        document.querySelector('.btnAgendar').innerText = 'Salvar'
    }

    // Adiciona evento de submit SEMPRE
    document.getElementById('formAgendamento')?.addEventListener('submit', handleSubmitAgendamento)
})
