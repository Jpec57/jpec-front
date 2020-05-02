const remoteUrl = "https://jpec.be/";

export const makeGetRequest = (uri: String): Promise<Response> => {
    return fetch(`${remoteUrl}${uri}`, {
        method: 'GET',
    }).then((response) => {
        return response.json();
    });
};

export const makePostRequest = (uri: String, data: Object): Promise<Response> => {
    return fetch(`${remoteUrl}${uri}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json();
    });
};

export const makePostFormRequest = (uri: String, data: FormData): Promise<Response> => {
    return fetch(`${remoteUrl}${uri}`, {
        method: 'POST',
        body: data
    }).then((response) => {
        return response.json();
    });
};