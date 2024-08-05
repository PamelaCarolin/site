import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(to_address, subject, body):
    # Configurações do servidor de e-mail
    smtp_server = 'smtp.seuprovedor.com'
    smtp_port = 587
    smtp_user = 'seuemail@provedor.com'
    smtp_password = 'suasenha'

    # Configurar a mensagem de e-mail
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = to_address
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    # Enviar o e-mail
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

# Exemplo de uso
to_address = 'cliente@example.com'
subject = 'Dados do Formulário'
body = 'Aqui estão os dados do formulário preenchido...'
send_email(to_address, subject, body)
