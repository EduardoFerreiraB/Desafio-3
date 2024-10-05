export default {
    jwt: {
        secret: process.env.JWT_SECRET || "secret",
        expiresIn: '12h',
    }
}
