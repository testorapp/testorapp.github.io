let API_BASE_URL = "";

const configReady = loadConfig();

async function loadConfig() {
    try {
        const response = await fetch("./config.json?v=" + Date.now());

        if (!response.ok) {
            throw new Error("Could not load config.json");
        }

        const config = await response.json();

        API_BASE_URL = config.API_BASE_URL.replace(/\/+$/, "");

        console.log("API URL:", API_BASE_URL);

    } catch (error) {
        console.error("Config loading error:", error);
    }
}


async function apiRequest(endpoint, options = {}) {

    // Wait until config.json has loaded
    await configReady;

    if (!API_BASE_URL) {
        throw new Error("API URL is not configured");
    }

    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options,
        credentials: "include"
    };

    try {
        const response = await fetch(url, config);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                "Request failed"
            );
        }

        return data;

    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
}


export async function register(userData) {
    return apiRequest("/api/register", {
        method: "POST",
        body: JSON.stringify(userData)
    });
}


export async function login(credentials) {
    return apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    });
}


export async function logout() {
    return apiRequest("/api/logout", {
        method: "POST"
    });
}


export async function getUser() {
    return apiRequest("/api/user");
}


export async function activateAccount(token) {
    return apiRequest(`/api/activate/${token}`);
}


export async function resendActivation(email) {
    return apiRequest("/api/resend-activation", {
        method: "POST",
        body: JSON.stringify({ email })
    });
}


export async function forgotPassword(email) {
    return apiRequest("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
    });
}


export async function resetPassword(token, passwordData) {
    return apiRequest(`/api/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify(passwordData)
    });
}


export async function getStats() {
    return apiRequest("/api/stats");
}


export async function getSites() {
    return apiRequest("/api/sites");
}
