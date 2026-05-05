export function adminTemplate(data, shop) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>

  <body style="margin:0; padding:0; background:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">

          <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff; margin:40px 0; border-radius:14px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.06);">

            <!-- Header -->
            <tr>
              <td style="background:#111827; padding:25px; text-align:center;">
                <img src="https://ai.online/cdn/shop/files/ai-online-white-H.svg?v=1776885625&width=160" width="150" />
                <h2 style="color:#fff; margin:15px 0 0;">New Domain Submission</h2>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:35px; color:#333;">

                <h3 style="margin-top:0;">Seller Information</h3>

                <table width="100%" style="background:#f9fafb; padding:18px; border-radius:10px; margin-bottom:25px;">
                  <tr><td><strong>Name:</strong> ${data.fullName}</td></tr>
                  <tr><td><strong>Email:</strong> ${data.email}</td></tr>
                  <tr><td><strong>Phone:</strong> ${data.phone}</td></tr>
                  <tr><td><strong>Shop:</strong> ${shop}</td></tr>
                </table>

                <h3>Domain Details</h3>

                <table width="100%" style="background:#f9fafb; padding:18px; border-radius:10px;">
                  <tr><td><strong>Domain:</strong> ${data.domain}</td></tr>
                  <tr><td><strong>Listing Type:</strong> ${data.listingType}</td></tr>
                  <tr><td><strong>Price:</strong> ${data.price}</td></tr>
                  <tr><td><strong>Min Offer:</strong> ${data.minOffer}</td></tr>
                  <tr><td><strong>Registrar:</strong> ${data.registrar}</td></tr>
                  <tr><td><strong>Expiry:</strong> ${data.expiry}</td></tr>
                  <tr><td><strong>Traffic:</strong> ${data.traffic}</td></tr>
                </table>

                ${
                  data.comments
                    ? `
                    <div style="margin-top:25px;">
                      <strong>Seller Notes</strong>
                      <p style="background:#f9fafb; padding:15px; border-radius:8px;">
                        ${data.comments}
                      </p>
                    </div>
                  `
                    : ""
                }

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#fafafa; padding:18px; text-align:center; font-size:12px; color:#777;">
                Automatic notification from ai.online - Domain Marketplace.
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