async function handleLogin() {
    const loginPlaceholder = { username: "testuser1updated", password: "123456" };
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginPlaceholder)
    });
    const data = await response.json();
    console.log(response);
    console.log(data);
    console.log(response.status);
};

handleLogin();