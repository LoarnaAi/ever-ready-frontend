import { JobData, BusinessMaster } from '../database.types';

export function generateJobReportHtml(job: JobData, business: BusinessMaster): string {
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Not specified';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTimeSlot = (slot?: string) => {
        if (!slot) return '';
        return ` (${slot})`;
    };

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
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 30px 20px;
    }
    .badge {
      display: inline-block;
      background-color: #fef3c7;
      color: #92400e;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 10px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .info-row {
      margin-bottom: 10px;
      line-height: 1.6;
    }
    .label {
      font-weight: bold;
      color: #6b7280;
      display: inline-block;
      width: 150px;
    }
    .value {
      color: #1f2937;
    }
    .address-box {
      background-color: #f9fafb;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 15px;
    }
    .address-title {
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 8px;
    }
    .note {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
      color: #1e40af;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Booking Received</h1>
    </div>
    
    <div class="content">
      <div class="section">
        <h2 style="margin: 0 0 10px 0; color: #1f2937;">Job Reference: ${job.display_job_id || job.job_id}</h2>
        <span class="badge">${job.status}</span>
      </div>

      <div class="section">
        <div class="section-title">Service Summary</div>
        <div class="info-row">
          <span class="label">Home Size:</span>
          <span class="value">${job.homeSize}</span>
        </div>
        <div class="info-row">
          <span class="label">Packing Service:</span>
          <span class="value">${job.packingService || 'None'}</span>
        </div>
        <div class="info-row">
          <span class="label">Dismantle Package:</span>
          <span class="value">${job.dismantlePackage ? 'Yes' : 'No'}</span>
        </div>
        <div class="info-row">
          <span class="label">Total Items:</span>
          <span class="value">${job.furnitureItems.length}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Customer Contact</div>
        <div class="info-row">
          <span class="label">Name:</span>
          <span class="value">${job.contact.firstName} ${job.contact.lastName}</span>
        </div>
        <div class="info-row">
          <span class="label">Email:</span>
          <span class="value">${job.contact.email}</span>
        </div>
        <div class="info-row">
          <span class="label">Phone:</span>
          <span class="value">${job.contact.countryCode} ${job.contact.phone}</span>
        </div>
      </div>

      ${job.collectionAddress || job.deliveryAddress ? `
      <div class="section">
        <div class="section-title">Addresses</div>
        ${job.collectionAddress ? `
        <div class="address-box">
          <div class="address-title">📍 Collection Address</div>
          <div>${job.collectionAddress.address}</div>
          <div>Postcode: ${job.collectionAddress.postcode}</div>
          <div>Floor: ${job.collectionAddress.floor}</div>
          <div>Parking: ${job.collectionAddress.hasParking ? 'Available' : 'Not Available'}</div>
          <div>Lift: ${job.collectionAddress.hasLift ? 'Available' : 'Not Available'}</div>
        </div>
        ` : ''}
        ${job.deliveryAddress ? `
        <div class="address-box">
          <div class="address-title">📍 Delivery Address</div>
          <div>${job.deliveryAddress.address}</div>
          <div>Postcode: ${job.deliveryAddress.postcode}</div>
          <div>Floor: ${job.deliveryAddress.floor}</div>
          <div>Parking: ${job.deliveryAddress.hasParking ? 'Available' : 'Not Available'}</div>
          <div>Lift: ${job.deliveryAddress.hasLift ? 'Available' : 'Not Available'}</div>
        </div>
        ` : ''}
      </div>
      ` : ''}

      ${job.collectionDate || job.materialsDeliveryDate ? `
      <div class="section">
        <div class="section-title">Schedule</div>
        ${job.collectionDate ? `
        <div class="info-row">
          <span class="label">Collection Date:</span>
          <span class="value">${formatDate(job.collectionDate.date)}${formatTimeSlot(job.collectionDate.timeSlot)}</span>
        </div>
        ` : ''}
        ${job.materialsDeliveryDate ? `
        <div class="info-row">
          <span class="label">Materials Delivery:</span>
          <span class="value">${formatDate(job.materialsDeliveryDate.date)}${formatTimeSlot(job.materialsDeliveryDate.timeSlot)}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}

      <div class="note">
        📎 <strong>Full job details are attached as a PDF.</strong><br>
        Please review the attachment for complete information including furniture items, packing materials, and cost breakdown.
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 5px 0;"><strong>${business.name}</strong></p>
      <p style="margin: 0;">Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
