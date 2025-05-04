const midtransClient = require('midtrans-client');

export const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

// export const core = new midtransClient.CoreApi({
//   isProduction: process.env.NODE_ENV === 'production',
//   serverKey: process.env.MIDTRANS_SERVER_KEY!,
// });
