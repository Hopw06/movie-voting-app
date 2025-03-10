import { getRefreshToken, getSession } from "@/access/auth";
import { Endpoint, PayloadRequest } from "payload";

export const Revoke : Endpoint = {
    path: '/auth/revoke',
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

            await req.payload.update({
                collection: 'session',
                data: {
                    status: 'inactive'
                },
                where: {
                    user: {equals: user.id}
                }
            })
        
            return Response.json({
              message: 'Revoke successfully',
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