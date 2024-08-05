from flask import Flask, request, redirect, url_for
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)

def send_email(to_address, subject, body):
    smtp_server = 'smtp.seuprovedor.com'
    smtp_port = 587
    smtp_user = 'seuemail@provedor.com'
    smtp_password = 'suasenha'
    
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = to_address
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_user, to_address, text)
        server.quit()
        print("E-mail enviado com sucesso!")
    except Exception as e:
        print(f"Falha ao enviar e-mail: {e}")

@app.route('/submit_form', methods=['POST'])
def submit_form():
    nome = request.form['nome']
    email = request.form['email']
    mensagem = request.form['mensagem']
    
    subject = 'Dados do Formulário'
    body = f'Nome: {nome}\nEmail: {email}\nMensagem: {mensagem}'
    
    send_email('seuemail@provedor.com', subject, body)
    
    return redirect(url_for('thank_you'))

@app.route('/thank_you')
def thank_you():
    return "Obrigado por enviar o formulário!"

if __name__ == '__main__':
    app.run(debug=True)
