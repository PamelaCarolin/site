document.addEventListener('DOMContentLoaded', function() {
    loadPDFs();

    document.getElementById('filter-form').addEventListener('submit', function(event) {
        event.preventDefault();
        loadPDFs();
    });
});

async function loadPDFs() {
    const companyName = document.getElementById('company-name').value.toLowerCase();
    const date = document.getElementById('date').value;

    // URL da função serverless no Netlify para listar os arquivos PDF
    const response = await fetch('/.netlify/functions/list-pdfs');
    const files = await response.json();

    const pdfList = document.getElementById('pdf-list');
    pdfList.innerHTML = '';

    const filteredFiles = files.filter(file => {
        let match = true;

        // Assumindo que os arquivos são nomeados de forma que podemos extrair a empresa e a data
        const [namePart, datePart] = file.name.split('_');

        if (companyName && !namePart.toLowerCase().includes(companyName)) {
            match = false;
        }

        if (date && datePart && datePart.split('.')[0] !== date) {
            match = false;
        }

        return match;
    });

    if (filteredFiles.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Não há dados para mostrar';
        pdfList.appendChild(li);
    } else {
        filteredFiles.forEach(file => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = file.download_url;
            a.textContent = file.name;
            li.appendChild(a);
            pdfList.appendChild(li);
        });
    }
}

async function sendEmail() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);

    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        pdfData: await generatePDFBase64(formData) // Função que converte dados do formulário para PDF em base64
    };

    const response = await fetch('https://prod2-30.brazilsouth.logic.azure.com:443/workflows/0ab4d42cfe9448a49c1dee6953e84284/triggers/manual/paths/invoke?api-version=2016-06-01', { // Substitua pelo seu endpoint Power Automate
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('E-mail enviado com sucesso! Uma cópia do PDF foi baixada para o seu dispositivo.');

        // Baixar a cópia do PDF para o cliente
        const pdfBase64 = data.pdfData;
        const link = document.createElement('a');
        link.href = 'data:application/pdf;base64,' + pdfBase64;
        link.download = 'formulario.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('Erro ao enviar e-mail.');
    }
}

async function generatePDFBase64(formData) {
    // Função que gera um PDF com os dados do formulário e retorna em base64
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text(`Nome: ${formData.get('name')}`, 10, 10);
    doc.text(`Email: ${formData.get('email')}`, 10, 20);
    doc.text(`Mensagem: ${formData.get('message')}`, 10, 30);

    return doc.output('datauristring').split(',')[1]; // Retorna apenas a parte base64
}
