// client/server/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function register(username: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    return res.json();
}

export async function login(username: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    return res.json();
}

export async function createLink(token: string, originalUrl: string, alternativeUrls: string[], weights: number[]) {
    const res = await fetch(`${API_URL}/links`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originalUrl, alternativeUrls, weights }),
    });
    return res.json();
}

export async function getLinks(token: string) {
    const res = await fetch(`${API_URL}/links`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

export async function getMetrics(token: string, id: string) {
    const res = await fetch(`${API_URL}/links/${id}/metrics`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

export async function getHistory(token: string, id: string) {
    const res = await fetch(`${API_URL}/links/${id}/history`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

export async function deleteLink(token: string, id: string) {
    const res = await fetch(`${API_URL}/links/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (res.status === 204) return { success: true }; // caso não tenha body
    return res.json();
}



