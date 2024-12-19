function checkForm() {
    const form = document.getElementById('form');
    const submitBtn = document.getElementById('submitBtn');
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");
    submitBtn.disabled = !allFilled;
    submitBtn.classList.toggle('enabled', allFilled);
}

document.getElementById('form').addEventListener('input', checkForm);

async function sendToWebhook(formData) {
    const webhookURL = "https://canary.discord.com/api/webhooks/1319354889536667779/R_qyAJbwE5w78iKJ0DJqDdGomSQaLQToL0hCoHMDvD60n5o3Ev-rs15J5-knLp08BdU-";
    const message = {
        content: "Novo Formulário Submetido",
        embeds: [{
            title: "Formulário Comanf",
            color: 0xFF0000, // Cor vermelha
            thumbnail: {
                url: "https://media.discordapp.net/attachments/1313212452821012552/1318942356078067742/4810e501604f87ef7283db65e2eba870.png?ex=676579ca&is=6764284a&hm=51c7db28a6ab1e1e00a8e2dfef330412d76f3cb1782dc5a75b7dee4b637bb9f7&=&format=webp&quality=lossless&width=230&height=230"
            },
            image: {
                url: "https://media.discordapp.net/attachments/1313212452821012552/1319060108466061353/image.png?ex=67653eb4&is=6763ed34&hm=47afb5bc1ace45346db0daeb46b12fd147a7dbc097ce7b0905f0ecb966a96b84&=&format=webp&quality=lossless&width=563&height=179"
            },
            fields: [
                { name: "Discord", value: formData.discord },
                { name: "Nome (OCC)", value: formData.nomeOCC },
                { name: "Nome e RG (IC)", value: formData.nomeRgIC },
                { name: "Idade (OCC)", value: formData.idade },
                { name: "Quantas Prisoes Tomou (IC)", value: formData.prisoes },
                { name: "Possui Porte de Arma (IC)", value: formData.porteArma },
                { name: "Possui CNH 'A e B' (IC)", value: formData.cnh },
                { name: "PC ou Mobile", value: formData.plataforma },
            ]
        }]
    };

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        });

        if (response.ok) {
            document.getElementById('successMessage').style.display = 'block';
        } else {
            console.error("Erro ao enviar formulário:", await response.json());
            alert("Erro ao enviar formulário.");
        }
    } catch (error) {
        console.error("Erro ao conectar ao Discord:", error);
        alert("Erro ao conectar ao Discord.");
    }
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    const submitBtn = document.getElementById('submitBtn');
    const waitMessage = document.getElementById('waitMessage');
    let timeLeft = localStorage.getItem('timeLeft') ? parseInt(localStorage.getItem('timeLeft')) : 0;

    if (timeLeft > 0) {
        waitMessage.style.display = 'block';
        submitBtn.disabled = true;  // Desabilita o botão
        submitBtn.textContent = 'Aguardando...'; // Muda o texto do botão

        const interval = setInterval(() => {
            if (timeLeft > 0) {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                localStorage.setItem('timeLeft', timeLeft);
                timeLeft--;
            } else {
                clearInterval(interval);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar';
                timerElement.style.display = 'none';
                waitMessage.style.display = 'none';
                localStorage.removeItem('timeLeft');
            }
        }, 1000);
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar';
        localStorage.removeItem('timeLeft');
    }
}

document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = {
        discord: document.getElementById('discord').value,
        nomeOCC: document.getElementById('nomeOCC').value,
        nomeRgIC: document.getElementById('nomeRgIC').value,
        idade: document.getElementById('idade').value,
        prisoes: document.getElementById('prisoes').value,
        porteArma: document.getElementById('porteArma').value,
        cnh: document.getElementById('cnh').value,
        plataforma: document.getElementById('plataforma').value,
    };

    sendToWebhook(formData);

    document.getElementById('submitBtn').disabled = true;
    document.getElementById('submitBtn').textContent = 'Aguarde...';
    let timeLeft = 45 * 60;
    localStorage.setItem('timeLeft', timeLeft);
    startTimer();
});

startTimer();
