import {Link} from "react-router-dom";
import {AllIcon, CategoryIcon, StarIcon, TagIcon} from "../vectors";
import React, {Dispatch, SetStateAction} from "react";
import {useGetQueryStr} from "../../hooks/useGetQueryStr";

interface IsetIsCategoryOpenProps {
    setIsCategoryOpen: Dispatch<SetStateAction<boolean>>;
    isCategoryOpen?: boolean;
}

export const MainMemoList: React.FC<IsetIsCategoryOpenProps> = (props: IsetIsCategoryOpenProps) => {
    const { setIsCategoryOpen  } = props;
    const { setSearchParams } = useGetQueryStr();

    return (
        <div className="flex flex-col font-bold gap-2px">
            <Link
                to="/memo"
                className='flex justify-between items-center hover:bg-zete-light-gray-200 rounded-[5px] p-10px group'
                onClick={()=> {
                    setIsCategoryOpen(false);
                    setSearchParams({});
                }}
            >
                <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                    <AllIcon className='mr-14px w-20px'/>
                    <span>전체메모</span>
                </div>
                <div className='rounded-full bg-zete-light-gray-300 text-zete-dark-100 py-2px px-8px text-12 group-hover:bg-white font-medium'>
                    <span className='relative bottom-1px'>
                        10
                    </span>
                </div>
            </Link>
            <button
                type="button"
                className='flex justify-between items-center hover:bg-zete-light-gray-200 rounded-[5px] p-10px group'
                onClick={()=> {
                    setIsCategoryOpen(false);
                    setSearchParams({ cate: "important" });
                }}
            >
                <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                    <StarIcon className='mr-14px w-20px'/>
                    <span>중요메모</span>
                </div>
                <div className='rounded-full bg-zete-light-gray-300 text-zete-dark-100 py-2px px-8px text-12 group-hover:bg-white font-medium'>
                    <span className='relative bottom-1px'>
                        10
                    </span>
                </div>
            </button>
        </div>
    )
}

export const CategoryList: React.FC<IsetIsCategoryOpenProps> = (props: IsetIsCategoryOpenProps) => {
    const { setIsCategoryOpen, isCategoryOpen } = props;
    const { setSearchParams, tagStr } = useGetQueryStr();

    const tagParamsHandler = (tagName: string) => {
        setSearchParams((prev) => {
            prev.set('tag', tagName)
            return prev
        })
    }

    return (
        <div
            className={`flex flex-col font-bold group rounded-[5px] hover:bg-zete-light-gray-200
                        ${isCategoryOpen ? 'bg-zete-light-gray-200' : 'bg-white'}`}
        >
            <div className='flex flex-col justify-center'>
                <button
                    type='button'
                    className='flex w-full justify-between items-center p-10px'
                    onClick={() => {
                        setIsCategoryOpen(!isCategoryOpen);
                        setSearchParams({ cate: '개발' })
                    }}
                >
                    <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                        <CategoryIcon className='mr-10px'/>
                        <span>개발</span>
                    </div>
                    <div
                        className={`rounded-full text-zete-dark-100 py-2px px-8px text-12 font-medium
                                    ${isCategoryOpen ? 'bg-white' : 'group-hover:bg-white bg-zete-light-gray-300'}`}
                    >
                        <span className='relative bottom-1px'>
                            2
                        </span>
                    </div>
                </button>
                <div
                    className={`overflow-hidden font-light text-13 transition-all duration-300 
                                ${isCategoryOpen ? 'max-h-[200px] p-12px' : 'h-[0vh] p-0'}`}
                >
                    <button
                        type='button'
                        className={`flex w-full h-fit py-8px pl-16px rounded-[5px] mb-1px hover:bg-zete-light-gray-500
                        ${tagStr === 'React' && 'bg-zete-light-gray-500'}`}
                        onClick={() => tagParamsHandler('React')}
                    >
                        <TagIcon svgClassName='w-14px mr-8px' strokeClassName='fill-zete-dark-200'/>
                        <span>React</span>
                    </button>
                    <button
                        type='button'
                        className={`flex w-full py-8px pl-16px rounded-[5px] hover:bg-zete-light-gray-500
                        ${tagStr === 'Nodejs' && 'bg-zete-light-gray-500'}`}
                        onClick={() => tagParamsHandler('Nodejs')}
                    >
                        <TagIcon svgClassName='w-14px mr-8px' strokeClassName='fill-zete-dark-200'/>
                        <span>Nodejs</span>
                    </button>
                </div>
            </div>
        </div>
    )
}