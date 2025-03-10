import { getRefreshToken, getSession } from "@/access/auth";
import { createJWT } from "@/lib/jwt";
import { Endpoint, PayloadRequest } from "payload";

export const Refresh : Endpoint = {
    path: '/auth/refresh',
    method: 'post',
    handler: async (req: PayloadRequest) => {   
        try {
            const refreshToken = getRefreshToken(req);
            console.log(refreshToken)
            const session = await getSession(req);
            if(!session || session.status === 'inactive') {
                return Response.json({
                    messsage: "Session not active"
                }, {
                    status: 403
                });
            };

            let user;
            if (typeof session.user === 'string') {
                user = await req.payload.findByID({
                    collection: 'users',
                    id: session.user
                })
            } else {
                user = session.user;
            }
        
            const accessToken = createJWT(user, process.env.ACCESS_TOKEN_SECRET ?? '', 30*60)
            
            return Response.json({
              message: 'Refresh token successfully',
              accessToken: accessToken,
              user: session.user
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