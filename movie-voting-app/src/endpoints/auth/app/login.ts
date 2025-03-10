import { Endpoint } from "payload";
import { createJWT } from "@/lib/jwt";
import { use } from "react";


export const Login : Endpoint = {
    path: '/auth/login',
    method: 'post',
    handler: async (req) => {
        const jsonReq = await req.json();
        console.log("jsonReq", jsonReq)
        const { email, password } = jsonReq;
        console.log(email, password)
    
        try {
            const user = await req.payload.login({
              collection: 'users',
              data: { email, password },
              overrideAccess: true,
            });

            if (!user || !user.user || !user.token) {

              return Response.json({
                message: 'Invalid email or password',
              }, {
                status: 500
              })
            }
        
            const refreshToken = createJWT({id: user.user.id}, process.env.REFRESH_TOKEN_SECRET ?? '', 7*24*60*60) 

            await req.payload.create({
              collection: 'session',
              data: {
                refreshToken: refreshToken,
                device: req.headers.get('user-agent'),
                ip: req.headers.get('host'),
                createdAt: new Date().toISOString(),
                user: user.user,
                status: 'active'
              }
            })

            const accessToken = createJWT(user.user, process.env.ACCESS_TOKEN_SECRET ?? '', 30*60)
            const cookie = `refresh-token=${refreshToken}; HttpOnly; Path=/; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`;

            return Response.json({
                message: 'Logged in successfully',
                accessToken: accessToken,
                user: user.user,
              }, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': cookie,
                  },
              })
          } catch (error) {
            console.error('Login Error:', error);
            return Response.json({
                message: 'Something went wrong',
              }, {
                status: 500
              })
          }
    }
}