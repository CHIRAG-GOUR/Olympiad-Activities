/**
 * Official Olympiad Digital Examination Platform - Faculty Email Invitation Template
 * Styled strictly to the platform's navy/cobalt design system.
 */

export interface TeacherInvitationData {
  teacherName: string;
  teacherEmail: string;
  teacherId: string;
  temporaryPassword: string;
  subjectName: string;
  assignedClasses: number[] | string[];
  invitedBy?: string;
  portalUrl?: string;
}

export function generateTeacherInvitationHtml(data: TeacherInvitationData): string {
  const portalUrl = data.portalUrl || "https://the-olympiad-dashboard.web.app/login";
  const resetUrl = `${portalUrl}?action=forgot&email=${encodeURIComponent(data.teacherEmail)}`;
  const classesText = Array.isArray(data.assignedClasses) && data.assignedClasses.length > 0
    ? data.assignedClasses.map((c) => `Class ${c}`).join(", ")
    : "Classes 6, 7, 8";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Faculty Access Invitation - Olympiad Digital Examination</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F7FB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #182338; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F4F7FB; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(24, 35, 56, 0.08); border: 1px solid #E1E7EF;">
          
          <!-- Header Banner (Olympiad Signature Navy) -->
          <tr>
            <td style="background: linear-gradient(135deg, #0B132B 0%, #182338 100%); padding: 36px 32px 30px 32px; text-align: left; border-bottom: 3px solid #2468B2;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display: inline-block; padding: 4px 10px; background: rgba(36, 104, 178, 0.25); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; font-size: 11px; font-weight: 700; color: #90CAF9; letter-spacing: 1px; text-transform: uppercase;">
                      Official Faculty Appointment
                    </div>
                    <h1 style="margin: 12px 0 4px 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em; line-height: 1.2;">
                      Olympiad Digital Examination
                    </h1>
                    <p style="margin: 0; font-size: 13px; color: #94A3B8; font-weight: 500;">
                      Cambridge Court International School (CCIS) &amp; Skillizee
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #182338;">
                Welcome, ${data.teacherName}
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475467;">
                You have been authorized as an official <strong>Olympiad Faculty Examiner &amp; Evaluator</strong>. You now have access to align examination papers to student candidates, oversee live progress, and analyze diagnostic score reports.
              </p>

              <!-- Credentials Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 18px 20px; background-color: #F1F5F9; border-bottom: 1px solid #E2E8F0;">
                    <span style="font-size: 11px; font-weight: 800; color: #2468B2; text-transform: uppercase; letter-spacing: 0.8px;">
                      Your Faculty Access Credentials
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #64748B; width: 130px; font-weight: 600;">Teacher ID:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #0F172A; font-family: monospace; font-weight: 700;">${data.teacherId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #64748B; font-weight: 600;">Registered Email:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #0F172A; font-weight: 700;">${data.teacherEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #64748B; font-weight: 600;">Temporary Pass:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #1E293B; font-family: monospace; font-weight: 800; background: #E2E8F0; padding-left: 8px; border-radius: 6px; display: inline-block;">${data.temporaryPassword}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #64748B; font-weight: 600;">Assigned Subject:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #0F172A; font-weight: 700;">${data.subjectName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #64748B; font-weight: 600;">Classes:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #0F172A; font-weight: 700;">${classesText}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center" style="padding: 4px 0;">
                    <a href="${portalUrl}" style="display: inline-block; background-color: #2468B2; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 2px 8px rgba(36, 104, 178, 0.35); text-align: center;">
                      Sign In to Teacher Dashboard &rarr;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <a href="${resetUrl}" style="display: inline-block; background-color: transparent; color: #2468B2; font-size: 13px; font-weight: 600; text-decoration: underline; text-align: center;">
                      Click here to set or change your password anytime
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-left: 4px solid #2468B2; border-radius: 0 10px 10px 0; padding: 14px 16px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 12.5px; color: #475467; line-height: 1.5;">
                      <strong>Security Note:</strong> For maximum account security, we recommend changing your password after signing in. You can also trigger a password reset at any time by clicking "Forgot Password" on the login screen.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #64748B; line-height: 1.5;">
                If you encounter any issues accessing your dashboard, please reach out directly to the technical team at <a href="mailto:tech@skillizee.io" style="color: #2468B2; text-decoration: none; font-weight: 600;">tech@skillizee.io</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0B132B; padding: 24px 32px; text-align: center; border-top: 1px solid #1E293B;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #94A3B8;">
                Olympiad Digital Examination Management
              </p>
              <p style="margin: 0; font-size: 11px; color: #64748B;">
                Cambridge Court International School (CCIS) &bull; Skillizee Technologies<br>
                This directive was issued by an authorized Super Administrator.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function generateTeacherInvitationPlainText(data: TeacherInvitationData): string {
  const portalUrl = data.portalUrl || "https://the-olympiad-dashboard.web.app/login";
  const resetUrl = `${portalUrl}?action=forgot&email=${encodeURIComponent(data.teacherEmail)}`;
  const classesText = Array.isArray(data.assignedClasses) && data.assignedClasses.length > 0
    ? data.assignedClasses.map((c) => `Class ${c}`).join(", ")
    : "Classes 6, 7, 8";

  return `OLYMPIAD DIGITAL EXAMINATION PLATFORM
Cambridge Court International School (CCIS) & Skillizee
Official Faculty Access Invitation

Dear ${data.teacherName},

You have been authorized as an official Olympiad Faculty Examiner & Evaluator. You can now align examination papers to student candidates, monitor live sessions, and view diagnostic score reports.

YOUR FACULTY CREDENTIALS:
- Portal URL: ${portalUrl}
- Teacher ID: ${data.teacherId}
- Official Email: ${data.teacherEmail}
- Temporary Password: ${data.temporaryPassword}
- Assigned Subject: ${data.subjectName}
- Assigned Classes: ${classesText}

HOW TO LOG IN:
1. Visit: ${portalUrl}
2. Enter your email (${data.teacherEmail}) and temporary password.
3. Access your Teacher Dashboard.

PASSWORD RESET:
You can reset or change your password anytime by visiting:
${resetUrl}
Or by clicking "Forgot Password" on the login screen.

Support: tech@skillizee.io
Authorized by: ${data.invitedBy || "Super Administrator"}
`;
}
