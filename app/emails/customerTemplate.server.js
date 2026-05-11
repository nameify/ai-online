export function customerTemplate(data) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>

  <body style="margin:0; padding:0; background:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">

          <!-- Card -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; margin:40px 0; border-radius:14px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.06);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#4f46e5,#9333ea); padding:30px; text-align:center;">
                <img src="https://ai.online/cdn/shop/files/ai-online-white-H.svg?v=1776885625&width=160" width="160" style="display:block; margin:auto;" />
                <h1 style="color:#ffffff; margin:15px 0 0; font-size:26px; font-weight:600;">
                  Submission Received 🎉
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:40px; color:#333;">
                <p style="font-size:16px;">Hi <strong>${data.fullName}</strong>,</p>

                <p style="font-size:15px; line-height:1.6;">
                  Thank you for submitting your domain to ai.online - Domain Marketplace.
                  Our team will carefully review your listing and contact you shortly.
                </p>

                <!-- Info Card -->
                <table width="100%" style="margin-top:25px; background:#f8f9ff; border-radius:10px; padding:18px;">
                  <tr>
                    <td style="font-size:14px; line-height:1.8;">
                      <strong>Domain:</strong> ${data.domain}<br/>
                      <strong>Price:</strong> ${data.price}<br/>
                      <strong>Minimum Offer:</strong> ${data.minOffer}
                    </td>
                  </tr>
                </table>

                <p style="margin-top:25px; font-size:15px;">
                  We appreciate your trust in ai.online 💜
                </p>

                <p style="margin-top:30px; font-size:14px; color:#666;">
                  — ai.online Team
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#fafafa; padding:20px; text-align:center; font-size:12px; color:#888;">
                © ${new Date().getFullYear()} ai.online. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}