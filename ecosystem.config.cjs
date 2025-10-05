module.exports = {
    apps: [
        {
            name: 'frontend',
            script    : "npx",
            interpreter: "none",
            args: "serve -s dist -p 3002"
        }
    ]
}