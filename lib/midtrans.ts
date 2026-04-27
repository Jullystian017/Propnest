import Midtrans from 'midtrans-client';

// Initializing Midtrans Snap Client
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

export const snap = new Midtrans.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-placeholder',
});

// For handling notification/webhook signature verification
export const core = new Midtrans.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-placeholder',
});
