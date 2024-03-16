from flask import Flask
from dotenv import load_dotenv
import os
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()  # Load environment variables

HOST = os.getenv('HOST')
PORT = int(os.getenv('PORT'))
MAIL = os.getenv('MAIL')
PASSWORD = os.getenv('PASSWORD')


def send_otp_email(email, otp):
    message = MIMEMultipart("alternative")
    message["Subject"] = "Mã OTP Xác Thực Tài Khoản"
    message["From"] = MAIL
    message["To"] = email

    # Tạo HTML và plain-text versions cho email
    text = f"Xin chào,\nMã OTP của bạn là: {otp}\nVui lòng không chia sẻ mã này với người khác."
    html = f"""<div style="width: 500px; margin: 0 auto;">
				<div style="display:flex; border-bottom: 1px solid #aaa; padding-bottom: 16px;">
					<h1>Verification account</h1>   
				</div>
				<p>Your OTP code is: </p>
				<h2><strong>{otp}</strong></h2>
				<p>Please enter this OTP code to verify your account.</p>
				<p>This OTP will expire later <strong>30</strong> minutes.</p>
    	</div>"""

    # Chuyển đổi cả hai phiên bản thành MIMEText objects và thêm vào MIMEMultipart message
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    message.attach(part1)
    message.attach(part2)

    # Tạo một kết nối an toàn với server và gửi email
    context = ssl._create_unverified_context()
    with smtplib.SMTP_SSL(HOST, PORT, context = context) as server:
        server.login(MAIL, PASSWORD)
        server.sendmail(MAIL, email, message.as_string())
    return "Email sent successfully."

