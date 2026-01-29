import { BookingConfirmationData } from '../messaging/types';
import { generateJobDetailUrl } from '../utils/urlUtils';

export function generateBookingConfirmationHtml(data: BookingConfirmationData): string {
  const formatDate = (value?: string) => {
    if (!value) return undefined;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const bookingRef = data.displayJobId || data.jobId;
  const collectionDate = formatDate(data.collectionDate);
  const collectionAddress = data.collectionAddress;
  const deliveryAddress = data.deliveryAddress;
  const jobDetailUrl = generateJobDetailUrl(data.busRef, data.displayJobId, data.jobId);

  const row = (label: string, value?: string) =>
    value
      ? `
        <tr>
          <td class="label">${label}</td>
          <td class="value">${value}</td>
        </tr>
      `
      : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #f97316;
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: bold;
    }
    .content {
      padding: 28px 20px;
      color: #1f2937;
    }
    .intro {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #111827;
      margin: 18px 0 10px 0;
      padding-bottom: 6px;
      border-bottom: 2px solid #e5e7eb;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      line-height: 1.6;
    }
    .label {
      width: 160px;
      color: #6b7280;
      font-weight: bold;
      padding: 6px 0;
      vertical-align: top;
    }
    .value {
      color: #111827;
      padding: 6px 0;
    }
    .note {
      margin-top: 20px;
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 12px 14px;
      font-size: 14px;
      color: #1e40af;
    }
    .footer {
      background-color: #f9fafb;
      padding: 16px 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .btn-primary {
      display: inline-block;
      background-color: #f97316;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmation</h1>
    </div>
    <div class="content">
      <p class="intro">Dear ${data.customerName},</p>
      <p class="intro">Thank you for choosing EverReady. Your home removal booking has been confirmed.</p>

      <div class="section-title">Booking Details</div>
      <table class="info-table" role="presentation">
        ${row('Booking Reference', bookingRef)}
        ${row('Home Size', data.homeSize)}
        ${row('Collection Date', collectionDate)}
        ${row('Collection Address', collectionAddress)}
        ${row('Delivery Address', deliveryAddress)}
      </table>

      <div class="section-title">Customer Information</div>
      <table class="info-table" role="presentation">
        ${row('Name', data.customerName)}
        ${row('Email', data.customerEmail)}
        ${row('Phone', `${data.countryCode}${data.customerPhone}`)}
      </table>

      <div class="note">
        We will contact you shortly to confirm the final details of your move.
        If you have any questions, please reply to this email.
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="${jobDetailUrl}" class="btn-primary">View Your Booking Details</a>
      </div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} EverReady - Your Trusted Moving Partner
    </div>
  </div>
</body>
</html>
  `.trim();
}
