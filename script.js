document.getElementById('client-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    var cnpj = document.getElementById('cnpj').value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var phone = document.getElementById('phone').value;
    var companyName = document.getElementById('company-name').value;
    var date = new Date().toISOString().split('T')[0];

    if (!validateCNPJ(cnpj)) {
        alert('CNPJ inválido! Deve conter 14 dígitos ou estar no formato 00.000.000/0000-00.');
        return;
    }

    if (!validateEmail(email)) {
        alert('E-mail inválido!');
        return;
    }

    if (!address) {
        alert('Endereço inválido!');
        return;
    }

    generatePDFAndOpenEmail();

    // Save data to JSON file
    const pdfData = {
        companyName,
        cnpj,
        email,
        address,
        phone,
        date,
        name: `${companyName}_dados_empresa.pdf`,
        download_url: `https://github.com/PamelaCarolin/site/main/data/${companyName}_dados_empresa.pdf`
    };

    await savePDFData(pdfData);
});

function validateCNPJ(cnpj) {
    var re = /^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2})$/;
    return re.test(cnpj);
}

function validateEmail(email) {
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
}

function generatePDFAndOpenEmail() {
    var { jsPDF } = window.jspdf;
    var doc = new jsPDF();

    var formData = new FormData(document.getElementById('client-form'));
    var companyName = formData.get('company-name');

    // Adicionar o logo e o título ao PDF
    var img = new Image();
    img.src = 'Logo_Multipla.jpg'; // Caminho para a imagem do logo
    img.onload = function() {
        doc.addImage(img, 'JPEG', 10, 10, 50, 25); // Adiciona o logo
        doc.setFontSize(22);
        var title = 'Multipla Contabilidade';
        var titleWidth = doc.getTextWidth(title);
        var pageWidth = doc.internal.pageSize.getWidth();
        var titleX = (pageWidth - titleWidth
