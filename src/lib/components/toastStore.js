import { writable } from "svelte/store";

export const toastMessage = writable('');
export const toastType = writable('');

export const showToast = (message, type, resetTime) => {
    toastMessage.set(message)
    toastType.set(type)

    if (resetTime) {
        setTimeout(() => {
            toastMessage.set()
            toastType.set()
        }, resetTime)
    }
};

export const dismissToast = () => {
    toastMessage.set()
    toastType.set()
};
