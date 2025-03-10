import { requireAuth } from "@/access/auth";
import { Endpoint, PayloadRequest } from "payload";

export const Me : Endpoint = {
    path: '/auth/me',
    method: 'post',
    handler: async (req: PayloadRequest) => {   
        try {
            const authResp = await requireAuth(req);
            if(!req.user && authResp) return authResp;
        
            return Response.json({
              user: req.user,
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