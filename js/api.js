let API_BASE_URL = "";

const configReady = loadConfig();

async function loadConfig() {
    try {
        const response = await fetch("./config.json?v=" + Date.now());

        if (!response.ok) {
            throw new Error("Could not load config.json");
        }

        const config = await response.json();
        API_BASE_URL = config.API_BASE_URL;
        console.log("API URL:", API_BASE_URL);

    } catch (error) {
        console.error("Config loading error:", error);
        // Visible fallback so users know the app is broken
        document.body.innerHTML = `
            <div style="padding:60px 20px;text-align:center;font-family:system-ui,sans-serif;">
                <h2 style="color:#ef4444;">⚠️ Configuration Error</h2>
                <p>Unable to load app settings. The backend may be offline.</p>
                <p style="color:#666;font-size:14px;">Error: ${error.message}</p>
                <button onclick="location.reload()" style="margin-top:20px;padding:10px 24px;border:none;border-radius:8px;background:#4f46e5;color:white;cursor:pointer;">
                    Retry
                </button>
            </div>
        `;
        throw error;
    }
}

async function apiRequest(endpoint, options = {}) {
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
            const error = new Error(
                data.error || data.message || `Request failed (${response.status})`
            );
            error.response = data;      // server response body
            error.status = response.status;
            throw error;
        }

        return data;

    } catch (err) {
        // Re-throw network errors or our custom errors
        if (!err.response && !err.status) {
            err.message = err.message || "Network error. Is the backend running?";
        }
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
