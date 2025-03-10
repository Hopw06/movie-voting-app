import { PayloadRequest } from 'payload';
import { verifyJWT } from "@/lib/jwt";

export const requireAuth = async (req: PayloadRequest) => {
  const session = await getSession(req);
  if(!session || session.status == 'inactive') {
    return new Response(JSON.stringify({ message: 'Session inactive' }), { status: 403 });
  }
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = verifyJWT(token, process.env.ACCESS_TOKEN_SECRET ?? '');
    req.user = user;
    return null;
  } catch (error) {
    console.log('error', error)
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
};

export const getRefreshToken = (req: PayloadRequest) => {
  const cookies = req.headers.get('cookie') ?? '';

  console.log(cookies);

  const cookiesArray = cookies.split('; ');

  const refreshTokenCookie = cookiesArray.find(cookie => cookie.startsWith('refresh-token='));

  if (refreshTokenCookie) {
     const refreshToken = refreshTokenCookie.split('=')[1];
    return refreshToken;
  }

  return null;
}

export const getSession = async (req: PayloadRequest) => {
  const refreshToken = getRefreshToken(req);
  const session = await req.payload.find(
    {
      collection: 'session',
      where: {
        refreshToken: {equals: refreshToken}
      },
      limit: 1
    }
  )
  return session && session.docs.length > 0 ? session.docs.at(0) : null
}
