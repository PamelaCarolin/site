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

    const response = await fetch('https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPOSITORIO/branch/path/to/data/data.json');
    const files = await response.json();

    const pdfList = document.getElementById('pdf-list');
    pdfList.innerHTML = '';

    const filteredFiles = files.filter(file => {
        let match = true;
        
        if (companyName && !file.companyName.toLowerCase().includes(companyName)) {
            match = false;
        }
        
        if (date && file.date !== date) {
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

async function savePDFData(data) {
    const response = await fetch('https://github.com/PamelaCarolin/site/edit/main/script.js/data.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer SEU_TOKEN'
        },
        body: JSON.stringify({
            message: "Add PDF data",
            content: btoa(JSON.stringify(data)),
            sha: await getFileSha()
        })
    });

    if (!response.ok) {
        throw new Error('Failed to save PDF data');
    }
}

async function getFileSha() {
    const response = await fetch('https://github.com/PamelaCarolin/site/edit/main/script.js');
    const data = await response.json();
    return data.sha;
}
