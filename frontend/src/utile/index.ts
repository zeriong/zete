import css from 'dom-css';
import {store} from "../store";
import {SET_DATA} from "../store/slices/memo.slice";

export const getCookie = (name: string) => {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? decodeURI(value[2]) : undefined;
}

export const setCookie = (name: string, val: string) => {
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    document.cookie = `${name}=${val}; path=/; max-age=${maxAge}; SameSite=Strict;`;
}

export const deleteCookie = (name: string) => {
    document.cookie = name+"=; max-age=0;";
}

export const existToken = () => {
    if (getCookie('rt')) {
        console.log(String(getCookie('rt')))
    } else { console.log(null); }
}

export const handleResizeHeight = (textareaRef) => {
    const ref = textareaRef.current;
    ref.style.height = 'auto';
    ref.style.height = ref.scrollHeight + 'px';
}


/** -------- 커스텀스크롤 function start ------- */
export const getInnerHeight = (el: HTMLDivElement) => {
    const { clientHeight } = el;
    const { paddingTop, paddingBottom } = getComputedStyle(el);
    return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
}

export const getInnerWidth = (el: HTMLDivElement) => {
    const { clientWidth } = el;
    const { paddingLeft, paddingRight } = getComputedStyle(el);
    return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
}

let scrollbarWidth: boolean | number = false;

export const getScrollbarWidth = (cacheEnabled = true) => {
    if (cacheEnabled && scrollbarWidth !== false) return scrollbarWidth;
    if (typeof document !== 'undefined') {
        const div = document.createElement('div');
        css(div, {
            width: 100,
            height: 100,
            position: 'absolute',
            top: -9999,
            overflow: 'scroll',
            MsOverflowStyle: 'scrollbar',
        });
        document.body.appendChild(div);
        scrollbarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
    } else {
        scrollbarWidth = 0;
    }
    return scrollbarWidth || 0;
}

export const isString = (maybe: string | number) => typeof maybe === 'string';

export const returnFalse = () => false;

/** -------- 커스텀스크롤 function end ------- */


export const uniqueKey = () => {
    const date = new Date();
    return Number(Date.now() +
        String(date.getDate()) +
        String(date.getMonth()) +
        String(Math.random()))
}

export const subUniqueKey = () => {
    const date = new Date();
    return Number(Date.now() +
        String(date.getDate()) +
        String(date.getMonth()) +
        String(date.getFullYear() +
            String(Math.random()))
    )
}

export const setData = () => store.dispatch(SET_DATA());