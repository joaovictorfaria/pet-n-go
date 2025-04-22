//Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) =>{
    e.preventDefault()
    const email =  document.getElementById('email').value
    const password = document.getElementById('password').value

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({email, password})
    })
    if(res.ok){
        const data = await res.json()
        localStorage.setItem('token', data.token)
        window.location.href = 'agendamentos.html'
    } else {
        const msg = await res.text()
        document.getElementById('message').innerText = msg
    }
})

//ROTA PRIVADA
async function acessar() {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/private',{
        headers:{Authorization: `Bearer ${token}`}
    })
    const data = await res.json()
    document.getElementById('dados').innerText = data.message 

    console.log('Token enviado:', token)
}

//LOGOUT
function logout(){
    window.location.href = '/login.html'
}

function voltarInicio(){
    window.location.href = '/index.html'
}