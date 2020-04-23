const remoteUrl = "http://51.158.152.165:8000";

export const makeGetRequest = (uri: String): Promise<Response> => {
    return fetch(`${remoteUrl}${uri}`, {
        method: 'GET'
    });
};

export const makePostRequest = (uri: String, body: BodyInit | null): Promise<Response> => {
    return fetch(`${remoteUrl}${uri}`, {
        method: 'POST',
        body: body,
    });
};