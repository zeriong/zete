import React, {ReactNode, useEffect, useRef, useState} from 'react';
import CustomScroller from './customScroller';
import {useWindowResize} from '../../hooks/useWindowResize';

export const HorizontalScroll = (props: { isShowButton?: boolean, bgColor?: string, className?: string, children: ReactNode }) => { // { type, text, disabled, loading, className, onClick }: IButtonProps
    const scrollOuter = useRef<HTMLDivElement>(null)
    const scrollInner = useRef<HTMLDivElement>(null)

    const scrollRef = useRef<CustomScroller>(null)

    const [ scrollLeft, setScrollLeft ] = useState(0)
    const [ isShowLeftButton, setIsShowLeftButton ] = useState(false)
    const [ isShowRightButton, setIsShowRightButton ] = useState(false)

    const windowResize = useWindowResize();

    const renderButton = () => {
        if (scrollLeft > 0) setIsShowLeftButton(true);
        else setIsShowLeftButton(false);

        if (scrollOuter.current?.offsetWidth && scrollInner.current?.offsetWidth && scrollOuter.current?.offsetWidth < scrollInner.current?.offsetWidth && scrollLeft != 1) {
            setIsShowRightButton(true);
        } else {
            setIsShowRightButton(false);
        }
    }

    useEffect(() => {
        // 스크롤 등 환경에 따라 버튼 노출 컨트롤
        renderButton();
    }, [windowResize.width, scrollLeft]);


    const handleWheel = (event: WheelEvent) => {
        // 마우스 세로휠 가로 적용
        let left = scrollRef.current?.getScrollLeft() + event.deltaY;
        if (left < 0) left = 0;
        if (left > scrollRef.current?.getScrollWidth()) left = scrollRef.current?.getScrollWidth();
        scrollRef.current?.scrollLeft(left);
        event.preventDefault();
    }

    useEffect(() => {
        const container = scrollOuter.current;
        container?.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container?.removeEventListener('wheel', handleWheel);
        }
    }, []);

    return (
        <div className={`relative w-full ${ props.className }`} ref={ scrollOuter }>
            <CustomScroller ref={ scrollRef } autoHeight={ true } autoHide={ true } customTrackHorizontalStyle={{ height: 4 }} onScrollFrame={(event: any) => {
                setScrollLeft(event.left);
            }}>
                <div className="flex shrink">
                    <div ref={ scrollInner }>
                        { props.children }
                    </div>
                </div>
            </CustomScroller>
            {props.isShowButton && (
                <>
                    {isShowLeftButton && (
                        <div
                            className="absolute flex items-center justify-start top-0 left-0 w-[40px] h-full cursor-pointer"
                            style={{background: `linear-gradient(-90deg,hsla(0,0%,100%,0),${ props.bgColor? props.bgColor: '#fff' } 50%)`}}
                            onClick={() => {
                                let left = scrollRef.current?.getScrollLeft() - 100;
                                if (left < 0) left = 0;
                                scrollRef.current?.scrollLeft(left);
                            }}
                        >
                            <div className="w-[12px] h-[12px] border-t border-l border-black border-opacity-50 -rotate-45 ml-0.5"/>
                        </div>
                    )}
                    {isShowRightButton && (
                        <div
                            className="absolute flex items-center justify-end top-0 right-0 w-[40px] h-full cursor-pointer"
                            style={{background: `linear-gradient(90deg,hsla(0,0%,100%,0),${ props.bgColor? props.bgColor: '#fff' } 50%)`}}
                            onClick={() => {
                                let left = scrollRef.current?.getScrollLeft() + 100;
                                scrollRef.current?.scrollLeft(left);
                            }}
                        >
                            <div className="w-[12px] h-[12px] border-t border-l border-black border-opacity-50 rotate-[135deg] mr-0.5"/>
                        </div>
                    )}
                </>
            )}
        </div>
    )
};