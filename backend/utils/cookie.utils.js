/**
 * Sets a secure HTTP-only cookie with the specified name and value.
 *
 * @param {Response} res - Express response object.
 * @param {string} name - Name of the cookie.
 * @param {string} value - Value of the cookie.
 * @param {number} maxAge - Maximum age in seconds. Defaults to 30 days.
 */

export const setSecureCookie = (res, name, value, maxAge = 30 * 24 * 60 * 60) => {
    res.cookie(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: maxAge * 1000,
    });
};
