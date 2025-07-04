import nodemailer from 'nodemailer';

export class EmailService {
  constructor() {
    // Validate required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.');
    }

    // Configure your email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOTP(email, otp) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Account Registration',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Labor Ministry - Account Verification</h2>
            <p>Hello,</p>
            <p>Thank you for registering with the Labor Ministry portal. To complete your registration, please use the following One-Time Password (OTP):</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #1e40af; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This OTP is valid for 10 minutes only</li>
              <li>Do not share this OTP with anyone</li>
              <li>Use this OTP to complete your registration process</li>
            </ul>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p>Best regards,<br>Labor Ministry Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`OTP sent successfully to ${email}`);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  async sendStatusUpdateEmail(
    
  ) {
    try {
      // Map status to more user-friendly text
      const statusMap = {
        submitted: 'Submitted',
        under_review: 'Under Review',
        background_check: 'Background Check in Progress',
        approved: 'Approved',
        rejected: 'Denied',
        requires_attention: 'Requires Additional Information'
      };

      const displayStatus = statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
      
      // Generate appropriate message based on status
      let statusMessage = '';
      switch (status) {
        case 'approved':
          statusMessage = 'We are pleased to inform you that your Work Permit application has been reviewed and approved by the Ministry of Labour of the Republic of Liberia.';
          break;
        case 'rejected':
          statusMessage = 'After careful review of your application, we regret to inform you that your Work Permit application has been denied.';
          break;
        case 'requires_attention':
          statusMessage = 'Upon review of your application, the Ministry of Labour has determined that additional information or documentation is required to process your Work Permit application further.';
          break;
        case 'under_review':
          statusMessage = 'This is to notify you that your application has been received and is now under review by the Work Permit Division of the Ministry of Labour.';
          break;
        case 'background_check':
          statusMessage = 'Your application is currently undergoing the mandatory background verification process in accordance with the Labour Laws of Liberia.';
          break;
        case 'submitted':
          statusMessage = 'We acknowledge receipt of your Work Permit application submitted to the Ministry of Labour of the Republic of Liberia.';
          break;
        default:
          statusMessage = `This is to inform you that the status of your Work Permit application has been updated to "${displayStatus}".`;
      }

      // Additional instructions based on status
      let additionalInstructions = '';
      switch (status) {
        case 'approved':
          additionalInstructions = 'Please visit the Ministry of Labour headquarters with your original identification documents and the permit number referenced below to collect your official Work Permit. The permit must be collected within 30 days of this notification.';
          break;
        case 'rejected':
          additionalInstructions = 'If you wish to appeal this decision, you may submit an appeal request through our online portal or in person at our headquarters within 14 days of this notification, in accordance with Section 14.3 of the Liberian Labour Law.';
          break;
        case 'requires_attention':
          additionalInstructions = 'Please log in to your account on the Ministry of Labour portal to view the specific requirements needed to progress your application. All requested documents should be submitted within 21 days to avoid automatic rejection of your application.';
          break;
      }

      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });

      const mailOptions = {
        from: `"Ministry of Labour, Republic of Liberia" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: `OFFICIAL NOTIFICATION: Work Permit Application ${displayStatus} - Ref: ${permitNumber}`,
        html: `
          <div style="font-family: 'Times New Roman', Times, serif; max-width: 700px; margin: 0 auto; border: 1px solid #003087; padding: 20px;">
            <!-- Header with Government Logo -->
            <div style="text-align: center; border-bottom: 2px solid #003087; padding-bottom: 15px; margin-bottom: 20px;">
              <h2 style="color: #003087; margin: 0;">REPUBLIC OF LIBERIA</h2>
              <h1 style="color: #003087; margin: 10px 0;">MINISTRY OF LABOUR</h1>
              <p style="margin: 5px 0;">Unity Road, Monrovia, Liberia</p>
            </div>
            
            <div style="padding: 0 15px;">
              <p style="text-align: right;">${currentDate}</p>
              
              <p style="font-weight: bold;">RE: WORK PERMIT APPLICATION - ${displayStatus.toUpperCase()}</p>
              
              <p>Dear Applicant,</p>
              
              <p>${statusMessage}</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; margin: 25px 0; border-left: 4px solid #003087;">
                <p style="margin: 5px 0; font-weight: bold;">APPLICATION DETAILS:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%;"><strong>Application Reference Number:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${applicationId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%;"><strong>Permit Number:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${permitNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%;"><strong>Current Status:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; color: ${
                      status === 'approved' ? '#006400' : 
                      status === 'rejected' ? '#8B0000' : 
                      '#003087'
                    };">${displayStatus}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%;"><strong>Date of Status Update:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${currentDate}</td>
                  </tr>
                  ${notes ? `
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 40%;"><strong>Official Notes:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${notes}</td>
                  </tr>` : ''}
                </table>
              </div>
              
              ${additionalInstructions ? `<p>${additionalInstructions}</p>` : ''}
              
              <p>For any inquiries regarding your application, please contact the Work Permit Division through any of the following channels:</p>
              <ul>
                <li>Phone: +231 88 123 4567</li>
                <li>Email: workpermits@labour.gov.lr</li>
                <li>Visit: Ministry of Labour Headquarters, Unity Road, Monrovia</li>
                <li>Office Hours: Monday to Friday, 9:00 AM - 4:00 PM</li>
              </ul>
              
              <p>When contacting us, please always reference your Permit Number for faster assistance.</p>
              
              <p>Thank you for your compliance with the Labour Laws of the Republic of Liberia.</p>
              
              <p style="margin-top: 30px;">Sincerely,</p>
              <p style="margin: 0;">Work Permit Division</p>
              <p style="margin: 0;">Ministry of Labour</p>
              <p style="margin: 0;">Republic of Liberia</p>
            </div>
            
            <!-- Footer -->
            <div style="margin-top: 30px; border-top: 2px solid #003087; padding-top: 15px; font-size: 12px; color: #555;">
              <p style="text-align: center;">This is an official communication from the Ministry of Labour of the Republic of Liberia.</p>
              <p style="text-align: center;">Please do not reply to this email. This mailbox is not monitored.</p>
              <p style="text-align: center;">&copy; ${new Date().getFullYear()} Ministry of Labour, Republic of Liberia. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Status update email sent successfully to ${email} for application ${applicationId}`);
    } catch (error) {
      console.error('Failed to send status update email:', error);
      throw new Error('Failed to send status update email');
    }
  }

  async sendPasswordResetOTP(email, otp) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset - Labor Ministry Portal',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Labor Ministry - Password Reset</h2>
            <p>Hello,</p>
            <p>You have requested to reset your password for the Labor Ministry portal. Please use the following One-Time Password (OTP) to complete the password reset process:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #1e40af; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This OTP is valid for 10 minutes only</li>
              <li>Do not share this OTP with anyone</li>
              <li>If you didn't request this password reset, please ignore this email or contact support</li>
            </ul>
            <p>After using this OTP, you will be prompted to create a new password. Your new password cannot be the same as your old password.</p>
            <p>Best regards,<br>Labor Ministry Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset OTP sent successfully to ${email}`);
    } catch (error) {
      console.error('Failed to send password reset OTP email:', error);
      throw new Error('Failed to send password reset OTP email');
    }
  }

  async sendFetalWatchOTP(email, otp, firstName) {
    try {
      const mailOptions = {
        from: `"FetalWatch Healthcare" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'FetalWatch - Email Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e7ff; border-radius: 8px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">FetalWatch</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Healthcare Monitoring System</p>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #1e40af; margin-top: 0;">Hello ${firstName},</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Welcome to FetalWatch! To complete your registration, please verify your email address using the code below:
              </p>
              
              <div style="background-color: #f8fafc; border: 2px dashed #667eea; padding: 30px; text-align: center; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Your Verification Code</p>
                <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
              </div>
              
              <p style="margin: 0; color: #92400e;"><strong>Important:</strong></p>
              <ul style="margin: 10px 0 0 0; color: #92400e;">
                <li>This code expires in 10 minutes</li>
                <li>Never share this code with anyone</li>
                <li>If you didn't create an account, please ignore this email</li>
              </ul>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} FetalWatch Healthcare. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`FetalWatch OTP sent successfully to ${email}`);
    } catch (error) {
      console.error('Failed to send FetalWatch OTP email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendFetalWatchPasswordResetOTP(email, otp, firstName) {
    try {
      const mailOptions = {
        from: `"FetalWatch Healthcare" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'FetalWatch - Password Reset Verification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fecaca; border-radius: 8px;">
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">FetalWatch</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Password Reset Request</p>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #dc2626; margin-top: 0;">Hello ${firstName},</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                We received a request to reset your FetalWatch account password. Use the code below to proceed:
              </p>
              
              <div style="background-color: #fef2f2; border: 2px dashed #ef4444; padding: 30px; text-align: center; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Password Reset Code</p>
                <h1 style="color: #ef4444; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
              </div>
              
              <p style="margin: 0; color: #92400e;"><strong>Security Notice:</strong></p>
              <ul style="margin: 10px 0 0 0; color: #92400e;">
                <li>This code expires in 10 minutes</li>
                <li>Only use this if you requested a password reset</li>
                <li>Never share this code with anyone</li>
              </ul>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} FetalWatch Healthcare. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`FetalWatch password reset OTP sent successfully to ${email}`);
    } catch (error) {
      console.error('Failed to send FetalWatch password reset OTP email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendPasswordResetConfirmation(email, firstName) {
    try {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const mailOptions = {
        from: `"FetalWatch Healthcare" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'FetalWatch - Password Reset Successful',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #d1fae5; border-radius: 8px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">FetalWatch</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Password Reset Confirmation</p>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #059669; margin-top: 0;">Hello ${firstName},</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Your FetalWatch account password has been successfully reset on <strong>${currentDate}</strong>.
              </p>
              
              <div style="background-color: #ecfdf5; border: 2px solid #10b981; padding: 25px; text-align: center; margin: 30px 0; border-radius: 8px;">
                <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                <h3 style="color: #059669; margin: 0;">Password Reset Complete</h3>
                <p style="margin: 10px 0 0 0; color: #065f46;">Your account is now secure with your new password</p>
              </div>
              
              <p style="margin: 0; color: #92400e;"><strong>Didn't reset your password?</strong></p>
              <p style="margin: 10px 0 0 0; color: #92400e;">
                If you didn't request this, please contact support immediately at support@fetalwatch.health
              </p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} FetalWatch Healthcare. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset confirmation sent successfully to ${email}`);
    } catch (error) {
      console.error('Failed to send password reset confirmation email:', error);
      throw new Error('Failed to send confirmation email');
    }
  }
}
