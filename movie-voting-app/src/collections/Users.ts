import type { CollectionConfig } from 'payload'
import { Login } from '../endpoints/auth/app/login'
import { requireAuth } from '@/access/auth';
import { Logout } from '@/endpoints/auth/app/logout';
import { Refresh } from '@/endpoints/auth/app/refresh';
import { Revoke } from '@/endpoints/auth/app/revoke';
import { Me } from '@/endpoints/auth/app/me';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    cookies: {
      sameSite: 'None',
      secure: true
    }
  },
  endpoints: [
    {
      path: '/test',
      method: 'get',
      handler: async (req) => {
        const authResp = await requireAuth(req);
        if(!req.user && authResp) return authResp;
        console.log(req.user);

        return Response.json({
          message: `Hello ${req.user?.email as string}`,
        })
      },
    },
    Login,
    Logout,
    Refresh,
    Revoke,
    Me
  ],
  fields: [
    {
      name: 'role',
      saveToJWT: true,
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' }
      ],
      admin: {
        position: 'sidebar',
      },
      access: {
        read: () => true,
        create: ({ req }) => req.user?.role === 'admin', 
        update: ({ req }) => req.user?.role === 'admin',
      }
    }
  ],
}
