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
        download_url: `https://raw.githubusercontent.com/PamelaCarolin/site/main/${companyName}_dados_empresa.pdf`
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
        var titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, 20); // Centraliza o título principal
        doc.setFontSize(16);

        // Ajustar o subtítulo para caber na linha
        var subtitle = 'Análise de dados para elaboração de prestação de serviço';
        var splitSubtitle = doc.splitTextToSize(subtitle, 120); // Ajusta a largura conforme necessário

        doc.text(splitSubtitle, 70, 30); // Adiciona o subtítulo

        var yOffset = 50; // Posição inicial para o conteúdo
        var lineHeight = 10; // Altura da linha para o conteúdo
        var pageHeight = doc.internal.pageSize.getHeight();
        var marginBottom = 20;

        // Adicionar as informações do formulário ao PDF com espaçamento
        formData.forEach(function(value, key) {
            if (yOffset > pageHeight - marginBottom) {
                doc.addPage();
                yOffset = 20;
            }
            doc.setFontSize(12);
            doc.text(`${translateField(key)}:`, 10, yOffset);
            yOffset += 6;
            var splitValue = doc.splitTextToSize(value, 180); // Ajustar a largura conforme necessário
            splitValue.forEach(function(line) {
                if (yOffset > pageHeight - marginBottom) {
                    doc.addPage();
                    yOffset = 20;
                }
                doc.text(line, 10, yOffset);
                yOffset += lineHeight;
            });
            yOffset += 4; // Espaço extra entre campos
        });

        doc.save(`${companyName}_dados_empresa.pdf`); // Salva o PDF no dispositivo do usuário com o nome da empresa
        showModal();
    };
}

function showModal() {
    var modal = document.getElementById("modal");
    var closeModal = document.getElementById("modal-close");
    var openEmail = document.getElementById("open-email");

    modal.style.display = "block";

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    openEmail.onclick = function() {
        modal.style.display = "none";
        openEmailClient();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function openEmailClient() {
    var email = "comercial@contabilmultipla.com.br";
    var subject = "Análise de Dados do Cliente";
    var body = "Segue o anexo de dados da empresa. Por favor, não esqueça de anexar o arquivo PDF salvo anteriormente.";

    var mailto_link = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto_link;
}

function translateField(field) {
    const translations = {
        "company-name": "Nome da empresa",
        "cnpj": "CNPJ",
        "address": "Endereço",
        "phone": "Telefone",
        "email": "E-mail para Contato",
        "branches": "Possui Filiais",
        "branch-quantity": "Quantidade de Filiais",
        "activity": "Ramo de atividade",
        "employees": "Quantidade de funcionários",
        "partners": "Quantidade de sócios administradores",
        "average-revenue": "Faturamento médio (mensal)",
        "banks": "Quantidade de bancos com que mantém suas operações",
        "tax-regime": "Regime de tributação",
        "debt": "Possui Débito ou parcelamento de impostos",
        "info-responsible": "Nome do responsável pelas informações",
        "system": "Empresa possui sistema?",
        "system-name": "Se sim, qual sistema",
        "additional-info": "Observações / dados adicionais"
    };
    return translations[field] || field;
}

document.querySelectorAll('.checkbox-group').forEach(group => {
    const checkboxes = group.querySelectorAll('.single-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                checkboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            }
        });
    });
});

async function savePDFData(newData) {
    const token = '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';
    const filePath = 'data.json';
    const repo = 'PamelaCarolin/site';
    const branch = 'main';

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`, {
        headers: {
            'Authorization': `token ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch file from GitHub');
    }

    const fileData = await response.json();
    const content = atob(fileData.content);
    const jsonData = JSON.parse(content);

    jsonData.push(newData);

    const updatedContent = btoa(JSON.stringify(jsonData, null, 2));

    const updateResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Add new PDF data',
            content: updatedContent,
            sha: fileData.sha,
            branch: branch
        })
    });

    if (!updateResponse.ok) {
        throw new Error('Failed to update file on GitHub');
    }
}
