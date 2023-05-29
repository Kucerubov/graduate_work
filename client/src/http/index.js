export const API_URl = 'http://localhost:5000/api';

export default function requestSend(method, url, body, auth = false) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        xhr.open(method, `${API_URl}${url}`);

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
