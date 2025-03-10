import { requireAuth } from "@/access/auth";
import { Endpoint } from "payload";

export const List : Endpoint = {
    path: '/list',
    method: 'post',
    handler: async (req) => {
        try {
              const authResp = await requireAuth(req);
              if(!req.user && authResp) return authResp;

              const movies = await req.payload.find({
                collection: 'movie',
                sort: '-votes',
              })

              return Response.json(
                {
                  movies: movies.docs
                }, 
                {
                  status: 200
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