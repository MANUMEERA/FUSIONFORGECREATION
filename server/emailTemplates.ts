/**
 * Email Templates for Fusion Forge Creation
 * Designed with universal inline CSS for pristine rendering across Gmail, Apple Mail, Outlook, and mobile clients.
 */

export interface EnquiryData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  gstin?: string;
  address?: string;
  serviceCategory?: string;
  budgetRange?: string;
  estimatedTimeline?: string;
  projectDescription?: string;
  featuresRequired?: string[] | string;
  source?: string;
  createdAt?: string;
}

export function formatServiceLabel(cat?: string): string {
  if (!cat) return 'Custom Software / Web Development';
  const map: Record<string, string> = {
    web_development: 'Web Applications & Portals',
    mobile_apps: 'Mobile Application (iOS / Android)',
    ui_ux_design: 'UI/UX Design & Prototyping',
    cloud_devops: 'Cloud Architecture & DevOps',
    ecommerce: 'E-Commerce & Digital Commerce',
    ai_automation: 'AI & Workflow Automation',
    api_integration: 'API & Microservices Architecture',
    maintenance: 'Maintenance & Managed Support'
  };
  return map[cat] || cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function generateAdminLeadAlertEmailHtml(enquiry: EnquiryData, officialEmail: string = 'admin@fusionforgecreation.com'): string {
  const serviceTitle = formatServiceLabel(enquiry.serviceCategory);
  const formattedDate = enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const featuresList = Array.isArray(enquiry.featuresRequired) 
    ? enquiry.featuresRequired.join(', ') 
    : (enquiry.featuresRequired || 'Standard Scope');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Lead Alert - Fusion Forge Creation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px 32px; text-align: left; border-bottom: 3px solid #2563eb;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background: #2563eb; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 6px; display: inline-block;">
                          ⚡ NEW CLIENT LEAD ALERT
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 12px 0 4px 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                      Fusion Forge Creation
                    </h1>
                    <p style="margin: 0; color: #94a3b8; font-size: 13px; font-weight: 500;">
                      Commercial Project Scope Submission Received
                    </p>
                  </td>
                  <td align="right" valign="top" style="display: table-cell;">
                    <div style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; padding: 8px 12px; text-align: right;">
                      <span style="display: block; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Status</span>
                      <span style="font-size: 13px; font-weight: 700; color: #38bdf8;">NEW LEAD</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Client Highlight Card -->
          <tr>
            <td style="padding: 24px 32px 12px 32px;">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td valign="middle">
                      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; display: block;">PROSPECTIVE CLIENT</span>
                      <span style="font-size: 20px; font-weight: 800; color: #0f172a; display: block; margin-top: 2px;">
                        ${enquiry.name}
                      </span>
                      ${enquiry.company ? `<span style="font-size: 13px; font-weight: 600; color: #2563eb; display: block; margin-top: 2px;">${enquiry.company}</span>` : ''}
                    </td>
                    <td align="right" valign="middle">
                      <div style="display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 6px 12px; text-align: right;">
                        <span style="font-size: 10px; font-weight: 600; color: #059669; text-transform: uppercase; display: block;">Estimated Budget</span>
                        <span style="font-size: 14px; font-weight: 800; color: #047857;">${enquiry.budgetRange || 'Flexible / Custom'}</span>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Key Information Grid -->
          <tr>
            <td style="padding: 12px 32px;">
              <h3 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #475569;">
                📋 Contact & Project Parameters
              </h3>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                <tr style="background-color: #ffffff;">
                  <td style="padding: 12px 16px; width: 35%; font-size: 13px; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9;">
                    Email Address
                  </td>
                  <td style="padding: 12px 16px; width: 65%; font-size: 13px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9;">
                    <a href="mailto:${enquiry.email}" style="color: #2563eb; text-decoration: none;">${enquiry.email}</a>
                  </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9;">
                    Phone Number
                  </td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9;">
                    ${enquiry.phone ? `<a href="tel:${enquiry.phone}" style="color: #0f172a; text-decoration: none;">${enquiry.phone}</a>` : '<span style="color: #94a3b8; font-weight: normal;">Not specified</span>'}
                  </td>
                </tr>
                <tr style="background-color: #ffffff;">
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9;">
                    Service Category
                  </td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9;">
                    <span style="background: #eff6ff; color: #1d4ed8; padding: 3px 8px; border-radius: 6px; font-size: 12px; border: 1px solid #dbeafe;">
                      ${serviceTitle}
                    </span>
                  </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9;">
                    Target Timeline
                  </td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9;">
                    ${enquiry.estimatedTimeline || 'Flexible / To be discussed'}
                  </td>
                </tr>
                ${enquiry.gstin ? `
                <tr style="background-color: #ffffff;">
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9;">
                    GSTIN / Tax ID
                  </td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9;">
                    <code>${enquiry.gstin}</code>
                  </td>
                </tr>` : ''}
                ${enquiry.address ? `
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9;">
                    Location / Address
                  </td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 500; color: #334155; border-bottom: 1px solid #f1f5f9;">
                    ${enquiry.address}
                  </td>
                </tr>` : ''}
                <tr style="background-color: #ffffff;">
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748b;">
                    Submission Time
                  </td>
                  <td style="padding: 12px 16px; font-size: 12px; font-weight: 500; color: #64748b;">
                    ${formattedDate} (IST)
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Project Description / Scope Brief -->
          <tr>
            <td style="padding: 12px 32px 24px 32px;">
              <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #475569;">
                📝 Project Requirements & Description
              </h3>
              <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 0 10px 10px 0; padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #1e293b; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                ${enquiry.projectDescription ? enquiry.projectDescription.replace(/\n/g, '<br/>') : '<em style="color: #94a3b8;">No detailed description provided by the client.</em>'}
              </div>
            </td>
          </tr>

          <!-- Quick Action Buttons -->
          <tr>
            <td style="padding: 0 32px 28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 8px; background: #2563eb; padding: 0 4px;">
                          <a href="mailto:${enquiry.email}?subject=Re:%20Your%20Project%20Enquiry%20-%20Fusion%20Forge%20Creation" style="background: #2563eb; border: 1px solid #2563eb; font-family: inherit; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">
                            ✉️ Reply to ${enquiry.name.split(' ')[0]}
                          </a>
                        </td>
                        ${enquiry.phone ? `
                        <td style="width: 12px;"></td>
                        <td style="border-radius: 8px; background: #0f172a; padding: 0 4px;">
                          <a href="tel:${enquiry.phone}" style="background: #0f172a; border: 1px solid #0f172a; font-family: inherit; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; display: inline-block;">
                            📞 Call Client
                          </a>
                        </td>` : ''}
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Technical Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                This lead notification was automatically generated by the <strong>Fusion Forge Creation</strong> Web Platform.<br/>
                Official Admin Gateway: <a href="mailto:${officialEmail}" style="color: #2563eb; text-decoration: none;">${officialEmail}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function generateCustomerAutoReplyEmailHtml(enquiry: EnquiryData, officialEmail: string = 'admin@fusionforgecreation.com'): string {
  const serviceTitle = formatServiceLabel(enquiry.serviceCategory);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Fusion Forge Creation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 32px 28px 32px; text-align: center; border-bottom: 3px solid #0284c7;">
              <div style="display: inline-block; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 20px; padding: 4px 14px; margin-bottom: 12px;">
                <span style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px;">
                  INQUIRY CONFIRMATION
                </span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                Fusion Forge Creation
              </h1>
              <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px; font-weight: 500; letter-spacing: 0.3px;">
                Custom Web Applications • Enterprise Software • Cloud Architecture
              </p>
            </td>
          </tr>

          <!-- Hero Greeting -->
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
                Thank You, ${enquiry.name}!
              </h2>
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569;">
                We have received your project inquiry. Our technical solutions team is already reviewing your scope and requirements to craft the best roadmap for your project.
              </p>
            </td>
          </tr>

          <!-- Project Snapshot Card -->
          <tr>
            <td style="padding: 8px 32px 20px 32px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td colspan="2" style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
                      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #2563eb;">
                        📌 SUBMITTED PROJECT SUMMARY
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0 6px 0; width: 40%; font-size: 13px; font-weight: 600; color: #64748b;">
                      Service Required:
                    </td>
                    <td style="padding: 10px 0 6px 0; width: 60%; font-size: 13px; font-weight: 700; color: #0f172a;">
                      ${serviceTitle}
                    </td>
                  </tr>
                  ${enquiry.company ? `
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">
                      Company / Org:
                    </td>
                    <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #0f172a;">
                      ${enquiry.company}
                    </td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">
                      Budget Preference:
                    </td>
                    <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #0f172a;">
                      ${enquiry.budgetRange || 'Flexible / To be finalized'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0 10px 0; font-size: 13px; font-weight: 600; color: #64748b;">
                      Timeline:
                    </td>
                    <td style="padding: 6px 0 10px 0; font-size: 13px; font-weight: 700; color: #0f172a;">
                      ${enquiry.estimatedTimeline || 'Standard Timeline'}
                    </td>
                  </tr>
                  ${enquiry.projectDescription ? `
                  <tr>
                    <td colspan="2" style="padding-top: 10px; border-top: 1px solid #f1f5f9;">
                      <span style="font-size: 11px; font-weight: 600; color: #64748b; display: block; margin-bottom: 4px;">Brief Scope:</span>
                      <span style="font-size: 13px; color: #334155; line-height: 1.5; display: block; font-style: italic; background: #ffffff; padding: 8px 12px; border-radius: 6px; border: 1px solid #edf2f7;">
                        "${enquiry.projectDescription.length > 180 ? enquiry.projectDescription.substring(0, 180) + '...' : enquiry.projectDescription}"
                      </span>
                    </td>
                  </tr>` : ''}
                </table>
              </div>
            </td>
          </tr>

          <!-- Next Steps Section -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <h3 style="margin: 0 0 14px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #0f172a;">
                🚀 What Happens Next?
              </h3>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="36" valign="top" style="padding-right: 12px; padding-bottom: 14px;">
                    <div style="width: 28px; height: 28px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 800; font-size: 13px;">
                      1
                    </div>
                  </td>
                  <td valign="top" style="padding-bottom: 14px;">
                    <strong style="font-size: 14px; color: #0f172a; display: block;">Technical & Scope Assessment</strong>
                    <span style="font-size: 13px; color: #64748b; line-height: 1.4; display: block; margin-top: 2px;">
                      Our solutions architects analyze your functional requirements and technology stack feasibility.
                    </span>
                  </td>
                </tr>

                <tr>
                  <td width="36" valign="top" style="padding-right: 12px; padding-bottom: 14px;">
                    <div style="width: 28px; height: 28px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 800; font-size: 13px;">
                      2
                    </div>
                  </td>
                  <td valign="top" style="padding-bottom: 14px;">
                    <strong style="font-size: 14px; color: #0f172a; display: block;">Tailored Architecture & Proposal</strong>
                    <span style="font-size: 13px; color: #64748b; line-height: 1.4; display: block; margin-top: 2px;">
                      We draft a customized proposal with clear milestone breakdowns and transparent commercials.
                    </span>
                  </td>
                </tr>

                <tr>
                  <td width="36" valign="top" style="padding-right: 12px;">
                    <div style="width: 28px; height: 28px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 800; font-size: 13px;">
                      3
                    </div>
                  </td>
                  <td valign="top">
                    <strong style="font-size: 14px; color: #0f172a; display: block;">Discovery Consultation</strong>
                    <span style="font-size: 13px; color: #64748b; line-height: 1.4; display: block; margin-top: 2px;">
                      We connect directly with you within <strong>24 business hours</strong> to finalize details.
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact Support Box -->
          <tr>
            <td style="padding: 0 32px 28px 32px;">
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #86efac; border-radius: 12px; padding: 18px 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td>
                      <span style="font-size: 13px; font-weight: 700; color: #166534; display: block;">
                        Need immediate assistance or have more files to share?
                      </span>
                      <span style="font-size: 12px; color: #15803d; display: block; margin-top: 3px;">
                        Simply reply directly to this email or reach us at <a href="mailto:${officialEmail}" style="color: #166534; font-weight: 700; text-decoration: underline;">${officialEmail}</a>
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Signature & Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: center; border-top: 1px solid #1e293b;">
              <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #f8fafc;">
                Fusion Forge Creation
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                Silvassa, Dadra & Nagar Haveli, India<br/>
                Email: <a href="mailto:${officialEmail}" style="color: #38bdf8; text-decoration: none;">${officialEmail}</a>
              </p>
              <p style="margin: 12px 0 0 0; font-size: 11px; color: #64748b;">
                © ${new Date().getFullYear()} Fusion Forge Creation. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
