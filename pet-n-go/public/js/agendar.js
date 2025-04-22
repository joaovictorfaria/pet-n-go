document.getElementById('formAgendamento')?.addEventListener('submit', async (e) => {
    e.preventDefault()

    const nomePet = document.querySelector('.nome input').value
    const servico = document.querySelector('.servico select').value 
    const data = document.querySelector('.data input').value 
    const hora = document.querySelector('.hora select').value
    const token = localStorage.getItem('token')

    const res =  await fetch('api/agendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({nomePet, servico, data, hora, fkImagem: idImagem})
    })

    if (res.ok){
        alert('Agendamento realizado com sucesso!')
        window.location.href = 'agendamentos.html'
    } else {
        const msg = await res.text()
        alert('Erro' + msg)
    }
})

let idImagem = null

document.querySelector('.btnUpload').addEventListener('click', async (e) => {
    e.preventDefault()

    const fileInput = document.getElementById('fotoPetInput')
    const file = fileInput.files[0]

    if (!file){
        alert('Selecione uma imagem primeiro!')
        return
    }

    const formData = new FormData()
    formData.append('foto', file)

    const token = localStorage.getItem('token')

    try{
        const res = await fetch('api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })

        if (res.ok){
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

const inputFoto = document.getElementById('fotoPetInput');
const previewImagem = document.getElementById('previewImagem');

inputFoto.addEventListener('change', () => {
    const file = inputFoto.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImagem.src = e.target.result; // Atualiza a imagem na tela
        }
        reader.readAsDataURL(file);
    }
});