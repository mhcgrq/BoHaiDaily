var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function makeQueryString(data) {
    const keys = Object.keys(data);
    let queryString = '';
    for (let i = 0, len = keys.length; i < len; i++) {
        if (i !== len - 1) {
            queryString += `${keys[i]}=${data[keys[i]]}&`;
        }
        else {
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
function makeFetch(dispatch, url, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let requireAuth = false;
        const f = yield fetch(url, config)
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
        }
        else if (requireAuth && url === USER_INFO) {
            cookie.remove('tokenId', { path: '/' });
            cookie.remove('rememberMeId', { path: '/' });
        }
        else {
            dispatch({
                type: 'REQUIRE_AUTH',
            });
        }
        throw 'require auth';
    });
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
        this.request = (url, config) => {
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
        };
        this.form = (url, formData, path = '', method = 'POST', params = {}) => {
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
        };
        this.json = (url, data, params = {}, path = '', method = 'POST') => {
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
        };
        this.get = (url, params = {}, path = '', method = 'GET') => {
            const config = {
                path,
                method,
                params
            };
            return this.request(url, config);
        };
        this.post = (url, params = {}, path = '', method = 'POST') => {
            const config = {
                path,
                method,
                params
            };
            return this.request(url, config);
        };
        this.delete = (url, params = {}, path = '', method = 'DELETE') => {
            const config = {
                path,
                method,
                params
            };
            return this.request(url, config);
        };
        this.put = (url, params = {}, path = '', method = 'PUT') => {
            const config = {
                path,
                method,
                params
            };
            return this.request(url, config);
        };
        this.dispatch = dispatch;
        this.getState = getState;
    }
}
// window.F = new Fetch();
//# sourceMappingURL=fetch.js.map