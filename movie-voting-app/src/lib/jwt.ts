import crypto from 'crypto';

function base64urlEncode(str: string) {
  return Buffer.from(str).toString('base64url');
}

export function createJWT(payload: Record<string, any>, secret: string, expiresIn: number) {
  console.log('secret', secret)
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  const fullPayload = { ...payload, exp };

  console.log(fullPayload)

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJWT(token: string, secret: string) {
  const [encodedHeader, encodedPayload, receivedSignature] = token.split('.');

  if (!encodedHeader || !encodedPayload || !receivedSignature) {
    throw new Error('Invalid token format');
  }

  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (computedSignature !== receivedSignature) {
    throw new Error('Invalid signature');
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
}
