import React from 'react';
import QRCode from 'qrcode.react';

export default function WhatsAppQR({ phoneNumber }) {
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <QRCode value={whatsappLink} size={120} />
      <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Scan to chat on WhatsApp</p>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <button className="btn btn-success mt-2">Chat on WhatsApp</button>
      </a>
    </div>
  );
}
