import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from src import env_config


def send_otp_email(email, otp):
    message = MIMEMultipart("alternative")
    message["Subject"] = "Mã OTP Xác Thực Tài Khoản"
    message["From"] = env_config.EMAIL_MAIL
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
    with smtplib.SMTP_SSL(
        env_config.EMAIL_HOST, env_config.EMAIL_PORT, context=context
    ) as server:
        server.login(env_config.EMAIL_MAIL, env_config.EMAIL_PASSWORD)
        server.sendmail(env_config.EMAIL_MAIL, email, message.as_string())
    return "Email sent successfully."
