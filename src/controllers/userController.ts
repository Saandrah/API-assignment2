// Author(s): Alma Isaksson
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
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

async function updateUser(request: Request, response: Response) {
    const userId = request.params.id;
    const {
        newUsername,
        // oldPassword,
        newPassword,
        setIsAdmin
    } = request.body;
    let fieldsToUpdate = {};
    const newUsernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const newPasswordRegex = /^[a-zA-Z0-9_.-]{6,20}$/;

    try {
        const currentUser = await User.findOne({_id: userId});
        if (!currentUser) {
            response.status(404).json({message: "This user does not exist"});
            return;
        };

        if (newUsername) {
            const existingAccount = await User.findOne({username: newUsername});
            if (existingAccount) {
                response.status(409).json({message: "This username is already taken"});
                return;
            };
            if (!newUsernameRegex.test(newUsername)) {
                response.status(401).json({message: "New username must be between 3 - 20 characters and may contain letters, numbers, and underscore"});
                return;
            };
            fieldsToUpdate = {...fieldsToUpdate, username: newUsername};
        };

        if (newPassword) {
            const newPasswordHashed = await bcrypt.hash(newPassword, 10);
            // if (!oldPassword) {
            //     response.status(401).json({message: "Old password may not be blank"});
            //     return;
            // };
            // const oldPasswordMatchHashed = await bcrypt.compare(oldPassword, currentUser.password);
            // if (!oldPasswordMatchHashed) {
            //     response.status(401).json({message: "Invalid old password"});
            //     return;
            // };
            if (!newPasswordRegex.test(newPassword)) {
                response.status(401).json({message: "New password must be between 6 - 20 characters and may contain letters, numbers, and these letters: - _ . (hyphen, underscore, dot)"});
                return;
            };
            fieldsToUpdate = {...fieldsToUpdate, password: newPasswordHashed};
        };

        if (setIsAdmin !== undefined) {
            if (typeof setIsAdmin !== "boolean") {
                response.status(401).json({message: "setIsAdmin must be a boolean"});
                return;
            };
            fieldsToUpdate = {...fieldsToUpdate, is_admin: setIsAdmin};
        };

        const result = await User.updateOne({_id: userId}, fieldsToUpdate);
        response.status(200).json({message: "User updated", result: result});
    } catch (error: unknown) {
        console.error("updateUser error:", error);
        response.status(500).json({message: "Server error while updating user"});
    };
};

async function deleteUser(request: Request, response: Response) {
    const id = request.params.id as String;

    try {
        const result = await User.deleteOne({_id: id});
        if (result.deletedCount === 0) {
            response.status(404).json({message: "User could not be found"});
            return;
        };
        response.status(200).json({message: "Successfully deleted user", result});
    } catch (error: unknown) {
        console.error("deleteUser error:", error);
        response.status(500).json({message: "Server error while delete user"});
    };
};
export const userController = {
    fetchAllUsers,
    fetchUser,
    updateUser,
    deleteUser
};