import React, {useRef, useEffect, TextareaHTMLAttributes} from 'react';

export const AutoResizeTextarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    // useForm 등으로 인한 내용 변화 감지 용도
    useEffect(() => {
        resizeTextarea();
    }, [props.value]);

    useEffect(() => {
        resizeTextarea();
    }, []);

    return (
        <textarea
            {...props}
            ref={textareaRef}
            // onFocus={resizeTextarea}
            onInput={() => {
                // 직접적인 입력 감지
                resizeTextarea()
            }}
        />
    );
};
