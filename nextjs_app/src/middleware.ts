import { NextRequest, NextResponse } from "next/server";
import { getToken, getUser } from "@/helpers/token_management";
import {responseBadRequest} from "@/helpers/responseHelpers";

export async function middleware(req: NextRequest) {
    let res = NextResponse.next();


    // res = new NextResponse(null, {
    //     headers: {
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    //         "Access-Control-Allow-Headers": "Content-Type, Authorization",
    //     },
    // });

    // Allow CORS for all requests
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,PATCH,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle OPTIONS method explicitly
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: res.headers,
        });
    }


    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/api/user")) {

        let token = getToken(req);

        if (!token) {
            return responseBadRequest("Unauthorized user");
        }

        try {
             await getUser(token);
            return res;
        } catch (error) {
            console.error(error);
            return responseBadRequest("No Token Found");
        }
    }

    return res; // Always return response with headers
}

// Apply middleware to all API routes
export const config = {
    matcher: "/api/:path*",
};
