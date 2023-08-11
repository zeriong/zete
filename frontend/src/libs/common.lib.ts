import css from 'dom-css';


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

// 문자열이 정수로 이뤄져 있는지
export const isIntegerString = (s?: string) => {
    const n = parseFloat(s);
    return !isNaN(n) && Number.isInteger(n);
};

// Textarea 입력에 따른 자동 높이 변화
export const setDynamicTextareaHeight = (target) => {
    if (target) {
        target.style.height = 'auto';
        target.style.height = target.scrollHeight + 'px';
    }
}

// input 입력에 따른 자동 넓이 변화
export const setDynamicInputWidth = (target) => {
    if (target) {
        target.style.width = '50px';
        target.style.width = target.scrollWidth + 'px';
    }
}

