export function authHeader() {
    // return authorization header with jwt token
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (user && token) {
        return { 'Authorization':  token, 'Content-Type': 'application/json' };
    } else {
        return {};
    }
}