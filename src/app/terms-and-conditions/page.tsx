import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="bg-everready-dark text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-everready-primary text-center">
          Terms and Conditions
        </h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Service Description</h2>
          <p>
            &quot;Ever Ready Response&quot; provides emergency response and service for property managers and their tenants. 
            Our service typically operates outside of normal business hours to handle urgent property-related issues.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Service Hours</h2>
          <p>
            Our out-of-hours service is available from 6:00 PM to 8:00 AM on weekdays, 
            and 24 hours on weekends and public holidays.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">User Eligibility</h2>
          <p>
            This service is available to property management companies, landlords, public institutions, 
            universities, and individuals and corporates. Users must be at least 18 years old and have 
            the authority to act on behalf of the properties they manage.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Registration and Account Security</h2>
          <p>
            To access our services, users must create an account. Users are responsible for maintaining 
            the confidentiality of their account information and for all activities that occur under their account. 
            Users must notify us immediately of any unauthorized use of their account.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Service Requests</h2>
          <p>
            Users may submit service requests through our website or mobile application. Each request must include:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>Property address</li>
            <li>Nature of the emergency</li>
            <li>Contact details for the tenant or occupant</li>
            <li>Any relevant access information</li>
          </ul>
          <p className="mt-4">
            We reserve the right to prioritize requests based on the urgency and nature of the emergency.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Response Times</h2>
          <p>
            While we strive to respond to all requests promptly, response times may vary depending on 
            the nature of the emergency and current demand. We do not guarantee specific response times.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Fees and Payment</h2>
          <p>
            Our fee structure is based on a monthly subscription plus per-call charges or a per-property 
            charge payable monthly. A one-off set-up fee may also be included depending on the client.
          </p>
          <p className="mt-4">
            Additional fees may apply for specialized services or extended call-outs.
          </p>
          <p className="mt-4">
            All fees are billed to the registered property management company or individual property manager, 
            not to tenants or occupants.
          </p>
          <p className="mt-4">
            Invoices are issued monthly and are due within 30 days.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Liability</h2>
          <p>
            We will make reasonable efforts to respond to and address emergency situations. However, 
            we are not liable for any damages resulting from delays in service or inability to access a property.
          </p>
          <p className="mt-4">
            Users agree to indemnify and hold us harmless from any claims arising from the use of our services.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Termination of Service</h2>
          <p>
            We reserve the right to suspend or terminate service to any user who violates these terms 
            and conditions or fails to pay for services rendered.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Changes to Terms and Conditions</h2>
          <p>
            We may update these terms and conditions from time to time. Users will be notified of any 
            significant changes, and continued use of the service constitutes acceptance of the updated terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Privacy and Data Protection</h2>
          <p>
            We collect and process personal data in accordance with our Privacy Policy, which is 
            incorporated by reference into these terms and conditions.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws 
            applicable in the United Kingdom (&apos;UK&apos;). Any disputes arising from these terms will be 
            subject to the exclusive jurisdiction of the courts in the UK.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-everready-primary">Contact Information</h2>
          <p>
            For any questions or concerns regarding these terms and conditions, please contact us at: 
            <a href="mailto:support@ever-ready.ai.com" className="text-everready-primary ml-2 hover:underline">
              support@ever-ready.ai.com
            </a>
          </p>
        </section>
        
        <section className="text-center">
          <p className="italic">
            By using our service, you acknowledge that you have read, understood, and agree to be 
            bound by these terms and conditions.
          </p>
        </section>
      </div>
    </div>
  );
}
