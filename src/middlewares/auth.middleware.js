import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.model.js";
import {
    verifyAccessTokenValidity,
    verifyRefreshTokenValidity,
    generateTokens,
    cookieOptions
} from "../utils/tokens.js";
import CustomError from "../errors/custome.error.js";


export const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
        return res.status(403).json(new ApiResponse(403, "Bad Request! Access token and refresh token not found in request cookies"));
    }

    try {
        // returns null on token expiry else returns decoded token
        let decodedAccessToken = verifyAccessTokenValidity(accessToken);

        // If access token is not valid, try to use refresh token
        if (!decodedAccessToken && refreshToken) {
            // returns null on token expiry else returns decoded token
            const decodedRefreshToken = verifyRefreshTokenValidity(refreshToken);

            // If refresh token is not valid, return unauthorized
            if (!decodedRefreshToken) {
                return res
                    .status(401)
                    .clearCookie("accessToken")
                    .clearCookie("refreshToken")
                    .json(new ApiResponse(401, "Unauthorized"));
            }

            // If refresh token is valid, update access token and refresh token
            // const user = await User.findById(decodedRefreshToken._id);
            // if (!user) {
            //     return res.status(404).json(new ApiResponse(404, "User not found"));
            // }
            const payload = {
                _id: user._id,
                email: user.email,
                role: user.role
            }
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(payload);

            req.user = payload;
            res
                .cookie("accessToken", newAccessToken, { ...cookieOptions })
                .cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        } else {
            req.user = decodedAccessToken;

        }
    } catch (error) {
        return res.status(401).json(new ApiResponse(401, "Unauthorized"));
    }

    next();
})


// Middleware for role-based access control
// restrictTo(['admin', 'instructor']),
// restrictTo(['admin']),
// restrictTo(['instructor']),
// restrictTo(['student']) etc...
export const restrictTo = (roles) => {
    return asyncHandler(async (req, res, next) => {
        // roles is an array ['admin', 'instructor']
        if (!roles.includes(req.user.role)) {
            throw new CustomError(
                403,
                "You do not have permission to perform this action",
            );
        }
        next();
    });
};

// Optional authentication middleware
// export const optionalAuth = asyncHandler();
