export const API_URl = 'http://localhost:5000/api';

export default function requestSend(method, url, body, auth = false) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, `${API_URl}${url}`);

        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;

        if(auth){
            xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
        }
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                resolve(xhr.response);
            }
        }
        xhr.onerror = () => {
            reject(xhr.response);
        }
        xhr.send(JSON.stringify(body));
    })
}