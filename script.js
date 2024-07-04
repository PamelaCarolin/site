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

    const response = await fetch('https://api.github.com/repos/PamelaCarolin/client-data/contents/submissions/pdf');
    const files = await response.json();

    const pdfList = document.getElementById('pdf-list');
    pdfList.innerHTML = '';

    const filteredFiles = files.filter(file => {
        let match = true;

        // Extraímos o nome da empresa e a data do nome do arquivo
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
