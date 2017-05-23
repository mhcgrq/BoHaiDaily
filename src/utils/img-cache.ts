import RNFetchBlob from 'react-native-fetch-blob';
import { ImageURISource, Platform } from 'react-native';

const SHA1 = require('crypto-js/sha1');

const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
const BASE_DIR = RNFetchBlob.fs.dirs.CacheDir + '/react-native-img-cache';
const FILE_PREFIX = Platform.OS === 'ios' ? '' : 'file://';

export type CacheHandlerFunc = (path: string, args?: { [key: string]: any; }) => void;
export type eventName = 'done' | 'progress' | 'failed';

interface CacheEntry {
    source: CachedImageSource;
    downloading: boolean;
    handlers: CacheHandler[];
    path: string | undefined;
    immutable: boolean;
    task?: any;
}

interface CacheHandler extends CacheHandlerFunc {
    done?: boolean;
    progress?: boolean;
    failed?: boolean;
}

interface CachedImageSource extends ImageURISource {
    uri: string;
}

export default class ImageCache {

    public static get(): ImageCache {
        if (!ImageCache.instance) {
            ImageCache.instance = new ImageCache();
        }
        return ImageCache.instance;
    }

    private static instance: ImageCache;

    private cache: { [uri: string]: CacheEntry } = {};

    public constructor() {}

    public clear() {
        this.cache = {};
        return RNFetchBlob.fs.unlink(BASE_DIR);
    }

    public on(source: CachedImageSource, handler: CacheHandler, eventName: eventName, immutable?: boolean) {
        const _handler = handler;
        _handler[eventName] = true;
        const { uri } = source;
        if (!this.cache[uri]) {
            this.cache[uri] = {
                source,
                downloading: false,
                handlers: [_handler],
                immutable: immutable === true,
                path: immutable === true ? this.getPath(uri, immutable) : undefined,
            };
        } else {
            this.cache[uri].handlers.push(_handler);
        }
        this.get(uri);
    }

    public dispose(uri: string, handler: CacheHandler) {
        const cache = this.cache[uri];
        if (cache) {
            cache.handlers.forEach((h, index) => {
                if (h === handler) {
                    cache.handlers.splice(index, 1);
                }
            });
        }
    }

    public disposeAll(uri: string) {
        const cache = this.cache[uri];
        if (cache) {
            cache.handlers = [];
        }
    }

    public bust(uri: string) {
        const cache = this.cache[uri];
        if (cache !== undefined && !cache.immutable) {
            cache.path = undefined;
            this.get(uri);
        }
    }

    public cancel(uri: string) {
        const cache = this.cache[uri];
        if (cache && cache.downloading) {
            cache.task.cancel();
        }
    }

    public retry(source: CachedImageSource) {
        const cache = this.cache[source.uri];
        this.download(cache);
    }

    private getPath(uri: string, immutable?: boolean): string {
        let path = uri.substring(uri.lastIndexOf('/'));
        path = path.indexOf('?') === -1 ? path : path.substring(path.lastIndexOf('.'), path.indexOf('?'));
        const ext = path.indexOf('.') === -1 ? '.jpg' : path.substring(path.indexOf('.'));
        if (immutable === true) {
            return BASE_DIR + '/' + SHA1(uri) + ext;
        } else {
            return BASE_DIR + '/' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4() + ext;
        }
    }

    private download(cache: CacheEntry) {
        const { source } = cache;
        const { uri } = source;
        if (!cache.downloading) {
            const path = this.getPath(uri, cache.immutable);
            cache.downloading = true;
            const method = source.method || 'GET';
            cache.task = RNFetchBlob.config({ path }).fetch(method as any, uri, source.headers);
            cache.task
                .progress((received: number, total: number) => {
                    this.notify(uri, 'progress', { received, total });
                })
                .then(() => {
                    cache.downloading = false;
                    cache.path = path;
                    this.notify(uri, 'done');
                })
                .catch(() => {
                    cache.downloading = false;
                    // Parts of the image may have been downloaded already,
                    // (see https://github.com/wkh237/react-native-fetch-blob/issues/331)
                    RNFetchBlob.fs.unlink(path);
                    this.notify(uri, 'failed');
                });
        }
    }

    private get(uri: string) {
        const cache = this.cache[uri];
        if (cache.path) {
            // We check here if IOS didn't delete the cache content
            RNFetchBlob.fs.exists(cache.path).then((exists: boolean) => {
                if (exists) {
                    this.notify(uri, 'done');
                } else {
                    this.download(cache);
                }
            });
        } else {
            this.download(cache);
        }

    }

    private notify(uri: string, eventName: eventName, args?: { [key: string]: any; }) {
        const handlers = this.cache[uri].handlers;
        handlers
            .filter((handler) => handler[eventName])
            .forEach((handler) => {
                handler(FILE_PREFIX + this.cache[uri].path as string, args);
            });
    }
}
