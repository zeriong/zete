import React, {useEffect, useState} from 'react';
import {UseFormReturn} from 'react-hook-form';
import {showAlert} from '../../../store/alert/alert.slice';
import {Api} from '../../../openapi/api';
import CustomScroller from '../../../common/components/customScroller';
import {setDynamicTextareaHeight} from '../../../libs/common.lib';

export const AskAI = (props: { isShow: boolean, memoForm: UseFormReturn<any> }) => {
    const [usableCount, setUsableCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [message, setMessage] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (usableCount <= 0) return showAlert('질문가능 횟수가 초과하였습니다, 매일 자정이 지나면 충전됩니다.');

        if (!inputValue || inputValue.length < 3) return showAlert('질문을 입력해 주시기 바랍니다.');
        
        setIsLoading(true);
        Api.openAi.createCompletion({ content: inputValue })
            .then((res) => {
                if (res.data?.success) {
                    // 사용자경험을 향상을 위해 요청을 받은 후 대기 시간동안 '답변이 거의 완성되었어요!' 문구를 띄움
                    setIsWaiting(true);

                    // gpt 3.5 turbo 무료 크레딧 특성상 요청이 매우느리고 연속요청에 에러를 발생시키기 때문에 요청에러방지,
                    setTimeout(() => {
                        setIsWaiting(false);
                        setIsLoading(false);
                    }, 5000);
                    
                    if (res.data.gptResponse) {
                        // setUsableCount(res.data.usableCount);
                        setMessage(res.data.gptResponse);
                    }
                } else if (res.data?.error) {
                    showAlert(res.data.error);
                    setIsLoading(false);
                }
            })
            .catch(() => {
                showAlert('응답 요청에 실패하였습니다.');
                setIsLoading(false);
            });
        setInputValue('');
    }

    useEffect(() => {
        if (props.isShow) {
            // ai 질문 모드로 전환시 질문 가능 횟수 로드
            Api.user.getGptUsableCount().then((res) => {
                if (res.data?.success) setUsableCount(res.data.count);
            });
        } else {
            // 초기화
            setUsableCount(0);
            setIsLoading(false);
            setIsWaiting(false);
            setMessage('');
            setInputValue('');
        }
    }, [props.isShow]);

    return (
        <section
            className={`flex flex-col transition-all duration-300 w-full bg-zete-gpt-100 h-0 rounded-b-[8px] overflow-hidden z-50 shadow-2xl
                ${ props.isShow && ' h-[400px] p-[10px]' }`}
        >
            <div className='flex flex-col w-full h-full'>
                <div className='relative flex flex-col grow text-start text-zete-dark-500 bg-white rounded-[8px] p-[8px] bg-opacity-80'>
                    <div className='relative text-center bg-zete-gpt-500 rounded-[8px] py-[4px] mb-[16px]'>
                        <span className='text-zete-gpt-black font-bold'>
                            Chat GPT
                        </span>
                        <div className='absolute top-1/2 -translate-y-1/2 text-[13px] right-[13px] text-white font-semibold'>
                            질문 가능 횟수: <span>{ usableCount }</span>
                        </div>
                    </div>
                    <div className='grow relative px-[8px]'>
                        {isLoading ? (
                            <>
                                { isWaiting ? '답변이 거의 완성되었어요!' : 'gpt가 답변을 준비하고 있어요! 다소 시간이 걸릴 수 있습니다.' }
                            </>
                        ) : (
                            <>
                                {message ? (
                                    <textarea
                                        readOnly={ true }
                                        value={ message }
                                        rows={ 1 }
                                        className='grow resize-none w-full !h-full pb-[46px] bg-transparent memo-custom-vertical-scroll overflow-auto'
                                    />
                                ) : (
                                    <>
                                        <p className='mb-[12px]'>궁금한 것이 있다면 GPT에게 물어보세요!</p>
                                        표준어를 사용해주세요!<br/>
                                        줄임말이나 신조어를 사용하면<br/>
                                        원하는 답변을 얻지 못할 수 있어요.<br/>
                                        [ 참고사항 ]<br/>
                                        1. gpt에게 물어볼 수 있는 횟수는 한 계정당 10번 물어볼 수 있어요.<br/>
                                        2. 하나의 질문에 한번의 답변만 할 수 있어요. (대화형식 불가)
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    {!isLoading && message && (
                        <button
                            type='button'
                            onClick={ () => { props.memoForm.setValue('content', message) } }
                            className='absolute bottom-[12px] left-1/2 -translate-x-1/2 transition-all duration-300 bg-zete-gpt-500 py-[4px] px-[8px] rounded-[8px] text-zete-light-gray-100 z-50'
                        >
                            메모에 추가하기 +
                        </button>
                    )}
                </div>
                <form
                    className={`relative shrink flex items-center justify-between p-[5px_0px_5px_12px] shadow-1xl rounded-[12px] mt-[10px]
                            border border-zete-light-gray-500 shadow-2xl ${ isLoading ? 'bg-zete-light-gray-300' : 'bg-white' }`}
                    onSubmit={ handleSubmit }
                >
                    <div className='flex items-center w-full'>
                        <CustomScroller autoHeight={ true } autoHeightMax={ 88 } customTrackVerticalStyle={{ width: 6 }}>
                            <textarea
                                value={ inputValue }
                                maxLength={ 500 }
                                rows={ 1 }
                                disabled={ isLoading }
                                placeholder='GPT에게 물어보세요! ( Shift + Enter 줄바꿈 )'
                                className='flex resize-none bg-transparent placeholder:text-zete-gray-500 font-light placeholder:text-[14px] w-full h-fit'
                                onChange={(event) => {
                                    setInputValue(event.target.value)
                                    setDynamicTextareaHeight(event.target)
                                }}
                                onKeyDown={(event) => {
                                    // shift + Enter = 줄바꿈, Enter = submit
                                    if (event.key === 'Enter' && !event.shiftKey) {
                                        handleSubmit(event)
                                    }
                                }}
                            />
                        </CustomScroller>
                    </div>
                    <button
                        type='submit'
                        className='absolute right-[12px] mx-[10px] px-[8px] bg-zete-gpt-200 text-white whitespace-nowrap h-fit text-[15px] rounded'
                    >
                        전송
                    </button>
                </form>
            </div>
        </section>
    )
}
