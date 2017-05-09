export default function get(url: string) {
    return fetch(url)
        .then((res) => {
            if (res.status === 200) {
                return res.text();
            }
            return Promise.reject('fetch failed');
        });
}
