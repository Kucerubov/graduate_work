export const API_URl = 'http://localhost:5000/api';

export default function requestSend(method, url, body, params = null, auth = false) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        let fullUrl = `${API_URl}${url}`;

        if(params){
            const queryString = Object.entries(params)
                .filter(([key, value]) => value !== undefined)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            fullUrl = `${API_URl}${url}?${queryString}`;
        }

        xhr.open(method, fullUrl);

        xhr.responseType = 'json';
        xhr.withCredentials = true;

        if (auth) {
            xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
        }

        // Добавляем данные в FormData
        for (const key in body) {
            formData.append(key, body[key]);
        }

        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                resolve(xhr.response);
            }
        };

        xhr.onerror = () => {
            reject(xhr.response);
        };
        xhr.send(formData);
    });
}
