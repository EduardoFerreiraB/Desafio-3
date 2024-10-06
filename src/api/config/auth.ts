export default {
    jwt: {
        secret: process.env.JWT_SECRET || "603ab11ed12e9458761f3760bd018650",
        expiresIn: '12h',
    }
}
