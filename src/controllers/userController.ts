// Author(s): Alma Isaksson
import { Request, Response } from "express";
import User from "../models/User";

async function fetchAllUsers(request: Request, response: Response) {
    try {
        const result = await User.find();
        response.status(200).json({message: "Found users", result: result});
    } catch (error: unknown) {
        response.status(500).json({message: "Server error while fetching all users"});
        console.log("fetchAllUsers error:", error);
    };
};

async function fetchUser(request: Request, response: Response) {
    const userId = request.params.id as string;

    try {
        const result = await User.findOne({_id: userId});
        if (!result) {
            response.status(404).json({message: "User could not be found"});
            return;
        };
        response.status(200).json({message: "Found user", result: result});
    } catch (error: unknown) {
        if (userId.length !== 24) {
            response.status(400).json({message: "Invalid user ID format"});
            return;
        };
        response.status(500).json({message: "Server error while fetching user"});
        console.error("fetchUser error:", error);
    };
};

export const userController = {
    fetchAllUsers,
    fetchUser
};