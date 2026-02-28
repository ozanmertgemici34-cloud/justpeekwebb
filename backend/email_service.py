import os
import secrets
from datetime import datetime, timedelta
from typing import Optional

# Simple email service (mock for now, can be replaced with SMTP)
class EmailService:
    @staticmethod
    async def send_email(to_email: str, subject: str, body: str):
        """Send email (mock implementation - logs to console)"""
        print(f"""
        ═══════════════════════════════════════
        📧 EMAIL NOTIFICATION
        ═══════════════════════════════════════
        To: {to_email}
        Subject: {subject}
        
        {body}
        ═══════════════════════════════════════
        """)
        # In production, replace with actual SMTP:
        # import smtplib
        # from email.mime.text import MIMEText
        # ... SMTP implementation
        return True

    @staticmethod
    async def send_welcome_email(user_email: str, user_name: str):
        """Send welcome email to new users"""
        subject = "Welcome to JustPeek! 🎮"
        body = f"""
Hi {user_name},

Welcome to JustPeek! Your account has been successfully created.

Get started by exploring our features and join our Discord community:
https://discord.gg/Z2MdBahqcN

Best regards,
The JustPeek Team
        """
        return await EmailService.send_email(user_email, subject, body)

    @staticmethod
    async def send_purchase_confirmation(user_email: str, user_name: str, product: str):
        """Send purchase confirmation email"""
        subject = f"Purchase Confirmed: {product} ✅"
        body = f"""
Hi {user_name},

Your purchase of {product} has been confirmed!

You can view your purchase details and download your product in your account dashboard.

Need help? Join our Discord: https://discord.gg/Z2MdBahqcN

Best regards,
The JustPeek Team
        """
        return await EmailService.send_email(user_email, subject, body)

    @staticmethod
    async def send_purchase_request_notification(admin_email: str, request_data: dict):
        """Notify admin of new purchase request"""
        subject = f"New Purchase Request from {request_data['discord_username']}"
        body = f"""
New purchase request received!

Email: {request_data['email']}
Discord: {request_data['discord_username']}
Product: {request_data['product']}
Message: {request_data.get('message', 'N/A')}

View and manage this request in your admin panel.
        """
        return await EmailService.send_email(admin_email, subject, body)

    @staticmethod
    async def send_password_reset_email(user_email: str, reset_token: str):
        """Send password reset email"""
        # In production, this would be a proper URL
        reset_link = f"https://justpeek.com/reset-password?token={reset_token}"
        subject = "Password Reset Request 🔐"
        body = f"""
You requested a password reset for your JustPeek account.

Click the link below to reset your password (valid for 1 hour):
{reset_link}

If you didn't request this, please ignore this email.

Best regards,
The JustPeek Team
        """
        return await EmailService.send_email(user_email, subject, body)

# Reset token management
reset_tokens = {}  # In production, use Redis or database

def generate_reset_token(email: str) -> str:
    """Generate a password reset token"""
    token = secrets.token_urlsafe(32)
    reset_tokens[token] = {
        "email": email,
        "expires_at": datetime.utcnow() + timedelta(hours=1)
    }
    return token

def verify_reset_token(token: str) -> Optional[str]:
    """Verify reset token and return email if valid"""
    if token not in reset_tokens:
        return None
    
    data = reset_tokens[token]
    if datetime.utcnow() > data["expires_at"]:
        del reset_tokens[token]
        return None
    
    email = data["email"]
    del reset_tokens[token]  # Token is single-use
    return email
