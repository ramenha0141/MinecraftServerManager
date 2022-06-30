import { ServerAPI } from './ServerAPI';

declare global {
    interface Window {
        ServerAPI: ServerAPI
    }
}
