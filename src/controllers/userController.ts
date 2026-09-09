// Author(s): Alma Isaksson
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";

// authentication
async function checkAuthentication(request: Request, response: Response) {
    try {
        response.status(200).json({message: "Authentication OK"});
    } catch (error: unknown) {
        response.status(500).json({message: "Server error during attempt of checking authentication"});
        console.error("checkAuthentication error:", error);
    };
};

async function signIn(request: Request, response: Response) {
    const { username, password } = request.body;

    try {
        if (!username) {
            response.status(401).json({message: "Username may not be blank"});
            return;
        };
        if (!password) {
            response.status(401).json({message: "Password may not be blank"});
            return;
        };

        const result = await User.findOne({username: username});
        if (!result) {
            response.status(401).json({message: "This user does not exist"});
            return;
        };

        const passwordMatchHashed = await bcrypt.compare(password, result?.password);
        if (!passwordMatchHashed) {
            response.status(401).json({message: "Invalid password"});
            return;
        };

        if (result) {
            const accessToken = jwt.sign({username}, process.env.JWT_SECRET || "", {expiresIn: "7d"});
            response.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false, // enable in production
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24 * 7 // one week
            });
            response.status(200).json({message: `Successfully signed in as "${username}"`, isSignedIn: true});
            return;
        } else {
            response.status(401).json({message: "Invalid credentials"});
            return;
        };
    } catch (error: unknown) {
        response.status(500).json({message: "Server error during attempt of signing in"});
        console.error("signIn error:", error);
    }
};

async function signOut(request: Request, response: Response) {
    try {
        response.clearCookie("accessToken");
        response.status(200).json({message: "Successfully signed out"});
    } catch (error: unknown) {
        response.status(500).json({message: "Server error during attempt of signing out"});
        console.error("signOut error:", error);
    };
};

async function register(request: Request, response: Response) {
    const {username, password, isAdmin} = request.body;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const passwordRegex = /^[a-zA-Z0-9_.-]{6,20}$/;

    try {
        if (username === undefined || !usernameRegex.test(username)) {
            response.status(400).json({message: "Username must be between 3 - 20 characters and may contain letters, numbers, and underscore"});
            return;
        };
        if (password === undefined || !passwordRegex.test(password)) {
            response.status(400).json({message: "Password must be between 6 - 20 characters and may contain letters, numbers, and these letters: - _ . (hyphen, underscore, dot)"});
            return;
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const existingAccount = await User.findOne({username: username});
        if (existingAccount) {
            response.status(409).json({message: "This username is already taken"});
            return;
        };

        const result = await User.insertOne({ username: username, password: hashedPassword, is_admin: isAdmin});
        response.status(201).json({message: `A new account under the name of "${username}" has been created`, result: result});
    } catch (error: unknown) {
        response.status(500).json({message: "Server error during attempt of registration"});
        console.error("register error:", error);
    };
};

// management
async function fetchAllUsers(request: Request, response: Response) {
    try {
        const result = await User.find();
        response.status(200).json({message: "Found users", result: result});
    } catch (error: unknown) {
        response.status(500).json({message: "Server error while fetching all users"});
        console.log("fetchAllUsers error:", error);
    };
};

const authentication = {
    checkAuthentication,
    signIn,
    signOut,
    register
};

const management = {
    fetchAllUsers,
    register
};

export const userController = {
    authentication,
    management
};