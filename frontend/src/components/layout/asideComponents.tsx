import {Link} from "react-router-dom";
import {AllIcon, CategoryIcon, StarIcon, TagIcon} from "../vectors";
import React, {Dispatch, SetStateAction, useEffect} from "react";
import {useGetQueryStr} from "../../hooks/useGetQueryStr";

const fetchData = () => {
    return null
}

interface IsetIsCategoryOpenProps {
    setIsCategoryOpen: Dispatch<SetStateAction<boolean>>;
    isCategoryOpen?: boolean;
}

export const MainMemoList: React.FC<IsetIsCategoryOpenProps> = (props: IsetIsCategoryOpenProps) => {
    const { setIsCategoryOpen  } = props;

    useEffect(()=>{
       fetchData();
    },[])

    return (
        <div className="flex flex-col font-bold gap-1px mt-17px">
            <Link
                to="/memo"
                className='flex justify-between items-center hover:bg-zete-light-gray-200 rounded-[5px] p-12px group'
                onClick={()=> setIsCategoryOpen(false)}
            >
                <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                    <AllIcon className='mr-14px w-20px'/>
                    <span>전체메모</span>
                </div>
                <div className='rounded-full bg-zete-light-gray-300 text-zete-dark-100 py-3px px-8px text-12 group-hover:bg-white font-medium'>
                    10
                </div>
            </Link>
            <Link
                to="/memo?search=important"
                className='flex justify-between items-center hover:bg-zete-light-gray-200 rounded-[5px] p-12px group'
                onClick={()=> setIsCategoryOpen(false)}
            >
                <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                    <StarIcon className='mr-14px w-20px'/>
                    <span>중요메모</span>
                </div>
                <div className='rounded-full bg-zete-light-gray-300 text-zete-dark-100 py-3px px-8px text-12 group-hover:bg-white font-medium'>
                    10
                </div>
            </Link>
        </div>
    )
}

export const CategoryList: React.FC<IsetIsCategoryOpenProps> = (props: IsetIsCategoryOpenProps) => {
    const { setIsCategoryOpen, isCategoryOpen } = props;
    const queryStr = useGetQueryStr();

    return (
        <div
            className={`flex flex-col font-bold group rounded-[5px] hover:bg-zete-light-gray-200
                        ${isCategoryOpen ? 'bg-zete-light-gray-200' : 'bg-white'}`}
        >
            <div className='flex flex-col justify-center'>
                <button
                    type='button'
                    className='flex w-full justify-between items-center p-12px'
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                    <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                        <CategoryIcon className='mr-10px'/>
                        <span>개발</span>
                    </div>
                    <div
                        className={`rounded-full text-zete-dark-100 py-3px px-8px text-12 font-medium
                                    ${isCategoryOpen ? 'bg-white' : 'group-hover:bg-white bg-zete-light-gray-300'}`}
                    >
                        2
                    </div>
                </button>
                <div
                    className={`overflow-hidden font-light text-13 transition-all duration-300 
                                ${isCategoryOpen ? 'max-h-[200px] p-12px' : 'h-[0vh] p-0'}`}
                >
                    <Link
                        to='/memo?search=React'
                        className={`flex h-fit py-8px pl-16px rounded-[5px] mb-1px hover:bg-zete-light-gray-500
                                    ${queryStr === 'React' && 'bg-zete-light-gray-500'}`}
                    >
                        <TagIcon svgClassName='w-14px mr-8px' strokeClassName='fill-zete-dark-200'/>
                        <span>React</span>
                    </Link>
                    <Link
                        to='/memo?search=Nodejs'
                        className={`flex py-8px pl-16px rounded-[5px] hover:bg-zete-light-gray-500
                                    ${queryStr === 'Nodejs' && 'bg-zete-light-gray-500'}`}
                    >
                        <TagIcon svgClassName='w-14px mr-8px' strokeClassName='fill-zete-dark-200'/>
                        <span>Nodejs</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}