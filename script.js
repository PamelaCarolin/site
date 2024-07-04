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

    const response = await fetch('https://mutiplacontabilidadepdf.netlify.app/data.json');
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
