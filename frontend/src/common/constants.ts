export const API_URL =  process.env.NODE_ENV === 'production' ? 'https://zete.com' : 'http://localhost:4000';

export const MEMO_LIST_REQUEST_LIMIT = 16;

export const PATTERNS = {
    VALID_PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    INPUT_PASSWORD: /[^A-Za-z\d@$!%*#?&]+/g,
    EMAIL: /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
};