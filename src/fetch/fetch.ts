function makeQueryString(data) {
    const keys = Object.keys(data);
    let queryString = '';
    for (let i = 0, len = keys.length; i < len; i++) {
        if (i !== len - 1) {
            queryString += `${keys[i]}=${data[keys[i]]}&`;
        } else {
            queryString += `${keys[i]}=${data[keys[i]]}`;
        }
    }
    return queryString;
}

function makeHeaders(customHeaders, getState) {
    const headers = {};
    const tokenId = cookie.get('tokenId');
    // const tokenId = 'c9881962cb174686aeb18bbfc00ff90d'
    if (tokenId) {
        headers.tokenId = tokenId;
    }
    if (customHeaders) {
        const customHeadersArr = Object.entries(customHeaders);
        for (let i = 0, len = customHeadersArr.length; i < len; i++) {
            headers[customHeadersArr[i][0]] = customHeadersArr[i][1];
        }
    }
    return headers;
}

function checkStatus(res) {
    if (res.status >= 200 && res.status < 400) {
        return res;
    }
    return res.json().then(body => {
        throw body;
    });
}

function checkResCode(res) {
    return res
        .json()
        .then(body => {
            if (body.responseCode === '000' || body.localeCode === 'locale.common[401]') {
                return body;
            }
            throw body;
        });
}

// function* handleAuth(dispatch, url, config) {
//     yield;
//     return makeFetch(dispatch, url, config);
// }

async function makeFetch(dispatch, url, config) {
    let requireAuth = false;
    const f = await fetch(url, config)
            .then(checkStatus)
            .then(checkResCode)
            .then(res => {
                if (res.responseCode === '401') {
                    requireAuth = true;
                }
                return res;
            });
    if (!requireAuth) {
        return f;
    } else if (requireAuth && url === USER_INFO) {
        cookie.remove('tokenId', { path: '/' });
        cookie.remove('rememberMeId', { path: '/' });
    } else {
        dispatch({
            type: 'REQUIRE_AUTH',
        });
    }
    throw 'require auth';
}

function makeUrl(url, query) {
    if (Object.keys(query).length > 0) {
        const allQuery = makeQueryString(query);
        return `${url}?${allQuery}`;
    }
    return url;
}

export default class Fetch {
    constructor(dispatch, getState) {
        this.dispatch = dispatch;
        this.getState = getState;
    }

    request = (url, config) => {
        let method;
        let newUrl = url;
        let body;
        const configkeys = Object.keys(config);
        for (let i = 0, len = configkeys.length; i < len; i++) {
            switch (true) {
                case configkeys[i] === 'path': {
                    newUrl = newUrl + config.path;
                    break;
                }
                case configkeys[i] === 'method': {
                    method = config.method;
                    break;
                }
                case configkeys[i] === 'params': {
                    newUrl = makeUrl(newUrl, config.params);
                    break;
                }
                case configkeys[i] === 'body': {
                    body = config.body;
                    break;
                }
                default:
            }
        }
        const headers = makeHeaders(config.headers);
        return makeFetch(this.dispatch, newUrl, {
            method,
            headers,
            body
        });
    }

    form = (url, formData, path = '', method = 'POST', params = {}) => {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        const body = makeQueryString(formData);
        const config = {
            path,
            headers,
            method,
            params,
            body
        };
        return this.request(url, config);
    }

    json = (url, data, params = {}, path = '', method = 'POST') => {
        const headers = {
            'Content-Type': 'application/json;charset=utf-8'
        };
        const config = {
            headers,
            path,
            params,
            method,
            body: JSON.stringify(data)
        };
        return this.request(url, config);
    }

    get = (url, params = {}, path = '', method = 'GET') => {
        const config = {
            path,
            method,
            params
        };
        return this.request(url, config);
    }

    post = (url, params = {}, path = '', method = 'POST') => {
        const config = {
            path,
            method,
            params
        };
        return this.request(url, config);
    }

    delete = (url, params = {}, path = '', method = 'DELETE') => {
        const config = {
            path,
            method,
            params
        };
        return this.request(url, config);
    }

    put = (url, params = {}, path = '', method = 'PUT') => {
        const config = {
            path,
            method,
            params
        };
        return this.request(url, config);
    }

    
}


// window.F = new Fetch();
