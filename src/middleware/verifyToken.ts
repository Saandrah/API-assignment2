// Author(s): Alma Isaksson
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function verifyToken(request: Request, response: Response, next: NextFunction) {
    const token = request.cookies.accessToken;
    if (token === undefined) {
        response.status(401).json({message: "Authentication unauthorized"});
        return;
    };

    jwt.verify(token, process.env.JWT_SECRET || "", (error: jwt.VerifyErrors | null) => {
        if (error) {
            response.status(403).json({message: "Authentication forbidden"});
            return;
        };
        next();
    });
};