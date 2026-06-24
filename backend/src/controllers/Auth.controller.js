import Tenant from "../models/Tenant.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

const createTenant = async (req, res) => {
    const { tenantName, phone, userName, email, password } = req.body;
    if(!tenantName || !phone || !userName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const existingTenant = await Tenant.findOne({ phone });
    if(existingTenant) {
        return res.status(400).json({ message: "Tenant with this phone number already exists" });
    }
    const existingUser = await User.findOne({email});
    if(existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
    }
    let user;
    let tenant;
    try{
        tenant = await Tenant.create({
            name: tenantName,
            phone
        });
        if(tenant) {
            console.log("Tenant created successfully");
        }
    } catch (error) {
        return res.status(500).json({ message: "Error creating tenant" });
    }
    try{
        user = await User.create({
            name: userName,
            email,
            password,
            role: "MANAGER",
            tenantId: tenant._id
        });
        if(user) {
            console.log("User created successfully");
        }
        
    } catch (error) {
        return res.status(500).json({ message: "Error creating user" });
    }
    return res
      .status(201)
      .json({ message: "Tenant and user created successfully", tenant, user });
}