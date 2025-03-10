import { getRefreshToken } from "@/access/auth";
import { Endpoint, PayloadRequest } from "payload";


export const Logout : Endpoint = {
    path: '/auth/logout',
    method: 'post',
    handler: async (req: PayloadRequest) => {   
        try {
            const refreshToken = getRefreshToken(req);
            console.log(refreshToken)
            await req.payload.update({
              collection: 'session',
              data: {
                status: 'inactive'
              },
              where: {
                refreshToken: {equals: refreshToken}
              }
            });
            
            return Response.json({
              message: 'Logout successfully'
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