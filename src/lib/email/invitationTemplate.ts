/**
 * Official Olympiad Dashboard - Faculty Email Invitation Template
 * Styled strictly to the platform's navy/cobalt design system with official Olympiad Dashboard logo.
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
  <title>Faculty Access Invitation - Olympiad Dashboard</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F7FB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #182338; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F4F7FB; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(24, 35, 56, 0.08); border: 1px solid #E1E7EF;">
          
          <!-- Header Banner (Olympiad Dashboard Signature Navy & Official Logo) -->
          <tr>
            <td style="background: linear-gradient(135deg, #0B132B 0%, #182338 100%); padding: 34px 32px 28px 32px; text-align: left; border-bottom: 3px solid #2468B2;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 14px;">
                    <!-- Official Olympiad Dashboard Logo Icon -->
                    <img src="https://the-olympiad-dashboard.web.app/assets/olympiad-icon.png" width="48" height="48" alt="Olympiad Dashboard Logo" style="display: block; width: 48px; height: 48px; border-radius: 13px; border: 0; outline: none; box-shadow: 0 4px 14px rgba(36, 104, 178, 0.45);" />
                  </td>
                  <td style="vertical-align: middle;">
                    <div style="display: inline-block; padding: 2px 8px; background: rgba(36, 104, 178, 0.35); border: 1px solid rgba(144, 202, 249, 0.3); border-radius: 6px; font-size: 10px; font-weight: 800; color: #90CAF9; letter-spacing: 1.2px; text-transform: uppercase;">
                      Faculty Access Directive
                    </div>
                    <div style="margin: 4px 0 2px 0; font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.02em; line-height: 1.2;">
                      Olympiad Dashboard
                    </div>
                    <div style="margin: 0; font-size: 12px; color: #94A3B8; font-weight: 500;">
                      Digital Examination &amp; Evaluation Platform
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 800; color: #182338;">
                Welcome, ${data.teacherName}
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475467;">
                You have been authorized as an official <strong>Faculty Examiner &amp; Evaluator</strong> on the <strong>Olympiad Dashboard</strong>. You now have full access to align examination papers to student candidates, oversee real-time progress, and review diagnostic score reports.
              </p>

              <!-- Credentials Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 20px; background-color: #F1F5F9; border-bottom: 1px solid #E2E8F0;">
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
                        <td style="padding: 6px 0; font-size: 14px; color: #1E293B; font-family: monospace; font-weight: 800; background: #E2E8F0; padding: 2px 8px; border-radius: 6px; display: inline-block;">${data.temporaryPassword}</td>
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
                    <a href="${portalUrl}" style="display: inline-block; background-color: #2468B2; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(36, 104, 178, 0.35); text-align: center;">
                      Sign In to Olympiad Dashboard &rarr;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 14px;">
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
                      <strong>Security Notice:</strong> Please sign in and change your password. You can also self-reset your password anytime from the login screen by clicking &ldquo;Forgot Password&rdquo;.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #64748B; line-height: 1.5;">
                If you have questions or need assistance, contact the platform team at <a href="mailto:tech@skillizee.io" style="color: #2468B2; text-decoration: none; font-weight: 600;">tech@skillizee.io</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0B132B; padding: 24px 32px; text-align: center; border-top: 1px solid #1E293B;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td style="vertical-align: middle; padding-right: 8px;">
                    <img src="https://the-olympiad-dashboard.web.app/assets/olympiad-icon.png" width="22" height="22" alt="Olympiad Dashboard" style="display: block; width: 22px; height: 22px; border-radius: 6px; border: 0; outline: none;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 13px; font-weight: 800; color: #E2E8F0;">
                      Olympiad Dashboard
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #94A3B8;">
                Digital Examination &amp; Faculty Evaluation System<br>
                Issued by Super Administrator &bull; Confidential
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

  return `OLYMPIAD DASHBOARD [Ω]
Digital Examination & Evaluation Platform
Official Faculty Access Directive

Dear ${data.teacherName},

You have been authorized as an official Faculty Examiner & Evaluator on the Olympiad Dashboard. You can now align examination papers to student candidates, monitor live sessions, and view diagnostic score reports.

YOUR FACULTY CREDENTIALS:
- Portal URL: ${portalUrl}
- Teacher ID: ${data.teacherId}
- Official Email: ${data.teacherEmail}
- Temporary Password: ${data.temporaryPassword}
- Assigned Subject: ${data.subjectName}
- Assigned Classes: ${classesText}

HOW TO LOG IN:
1. Visit: ${portalUrl}
2. Enter your registered email (${data.teacherEmail}) and temporary password.
3. Access your Teacher Dashboard.

PASSWORD RESET:
You can reset or change your password anytime by visiting:
${resetUrl}
Or by clicking "Forgot Password" on the login screen.

Support: tech@skillizee.io
Authorized by: ${data.invitedBy || "Super Administrator"}
`;
}
