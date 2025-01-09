import jwt from 'jsonwebtoken';

//here domain, which can access this cookie like localhost, www.checkedspot.com
//specify .checkedspot.com, isetn this case all the subdomains can also access this cookie like blog.checkedspot.com, checkedspot.com
export const cookieOptions = {
    domain: process.env.DOMAIN,
    path: "/",
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

export const generateRefreshToken = (payload) => {
    const tokenSignature = {
        _id: payload?._id,
    }
    return jwt.sign(
        tokenSignature,
        process.env.REFRESH_TOKEN_SECRET,
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY, 
            algorithm: 'HS256' 
        }
    );
};

export const generateAccessToken = (payload) => {
    const tokenSignature = {
        _id: payload?._id,
        email: payload?.email,
        role: payload?.role
    }

    return jwt.sign(
        tokenSignature,
        process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY, 
            algorithm: 'HS256' 
        }
    );
};

export const generateTokens = (payload) => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
}

export const verifyRefreshTokenValidity = (token) => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}

export const verifyAccessTokenValidity = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}


