// Author(s): Alma Isaksson
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export async function checkAdmin(request: Request, response: Response, next: NextFunction) {
    const token = request.cookies.accessToken;
    if (token === undefined) {
        response.status(401).json({message: "Unauthorized: no token"});
        return;
    };

    jwt.verify(token, process.env.JWT_SECRET || "", async (error: jwt.VerifyErrors | null, decodedToken: any) => {
        if (error) {
            response.status(403).json({message: "Forbidden: invalid token"});
            return;
        };
        const username = decodedToken.username;
        const userTarget = await User.findOne({username: username});
        if (!userTarget) {
            response.status(404).json({message: "User not found"});
            return;
        };
        const isAdmin = userTarget.is_admin;
        if (isAdmin) {
            // console.log(`${username} is admin`);
            next();
        } else {
            response.status(403).json({message: "User does not have admin priviedges"});
            return;
        };
    });
};