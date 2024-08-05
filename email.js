document.getElementById('filter-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const companyName = document.getElementById('company-name').value;
    const date = document.getElementById('date').value;
    
    const data = {
        company_name: companyName,
        date: date
    };

    fetch('/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('E-mail enviado com sucesso!');
        } else {
            alert('Falha ao enviar e-mail.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});
