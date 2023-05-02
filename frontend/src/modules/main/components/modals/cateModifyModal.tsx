import React, {Fragment, useEffect, useRef, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {CatePlusIcon, DeleteIcon, FillCategoryIcon, ModifyIcon} from "../../../../assets/vectors";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import CustomScroller from "../../../../common/components/customScroller";
import {ADD_CATE, DELETE_CATE, UPDATE_MANY_CATE, UPDATE_ONE_CATE} from "../../../../store/slices/memo.slice";
import {Api} from "../../../../common/libs/api";
import {Category} from "../../../../store/slices/constants";

export const CateModifyModal = () => {
    const deleteButtonRef = useRef(null)

    const { data } = useSelector((state: RootState) => state.memo);

    const categories = data.cate

    const [isShow, setIsShow] = useState(false);
    const [newCateListNames, setNewCateListNames] = useState<string[]>(categories.map(cate => cate.cateName));
    const [newCateList, setNewCateList] = useState<Category[]>(categories);
    const [addCateValue, setAddCateValue] = useState<string>('');
    const [isAgreeShow, setIsAgreeShow] = useState<boolean>(false);
    const [getCateId, setGetCateId] = useState<number>(0);

    const dispatch = useDispatch();

    const addCateValChange = (e) => setAddCateValue(e.target.value);

    const addCate = (e: any) => {
        e.preventDefault();
        if (categories.some(cate => cate.cateName === addCateValue)) return alert('새 카테고리 이름이 기존 카테고리 이름과 중복됩니다.')

        Api().memo.createCate({ cateName: addCateValue })
            .then((res) => {
                if (res.data.success) {
                    dispatch(ADD_CATE(res.data.savedCate));
                    setAddCateValue('');
                } else {
                    alert(res.data.error);
                }})
            .catch(e => console.log(e))
    }

    const handleDelete = () => {
        Api().memo.deleteCate({ cateId: getCateId })
            .then((res) => {
                if (res.data.success) {
                    setIsAgreeShow(false);
                    deleteCate(getCateId, res.data.importantMemoLength);
                } else {
                    alert(res.data.error);
                }})
            .catch(e => console.log(e))
    }

    const deleteCate = (cateId: number, importantMemoLength: number) => {
        dispatch(DELETE_CATE({cateId, importantMemoLength}));
    }

    const handleUpdateName = (idx, event) => {
        const newNames = [...newCateListNames];
        newNames[idx] = event.target.value;
        setNewCateListNames(newNames);
    }

    const updateManyCate = () => {
        if (newCateListNames.some(name => name === '')) return alert('비어있는 태그를 삭제하거나 수정할 이름을 입력하세요.');
        if (newCateListNames.length !== new Set(newCateListNames).size) return alert('중복된 카테고리가 존재합니다.')
        console.log('뉴케이트리스트',newCateList)
        Api().memo.updateManyCate({data: newCateList})
            .then((res) => {
                if (res.data.success) {
                    setIsShow(false);
                    dispatch(UPDATE_MANY_CATE(newCateList));
                } else {
                    alert(res.data.error)
                }})
            .catch(e => console.log(e))

        }

        const updateOneCate = (target: {cateId:number, val:string, event: React.FormEvent<HTMLFormElement>}) => {
            target.event.preventDefault();
            if (newCateListNames.some(name => name === '')) return alert('비어있는 카테고리를 삭제하거나 수정할 이름을 입력하세요.');

            const inputCate = {cateId:target.cateId, cateName:target.val};

            Api().memo.updateOneCate(inputCate)
                .then((res) => {
                    if (res.data.success) {
                        dispatch(UPDATE_ONE_CATE(inputCate));
                        target.event.currentTarget.blur();
                    } else {
                        alert(res.data.error)
                    }})
                .catch(e => console.log(e))
        }

        useEffect(() => {
            setNewCateList(categories);
            setNewCateListNames(categories.map(cate => cate.cateName));
        },[data])

        useEffect(() => {
            const reBuildNewCate = data.cate.map((cate, idx) => {
            return {
                cateId: cate.cateId,
                cateName: newCateListNames[idx]
            }
        })
            setNewCateList(reBuildNewCate)
        }, [newCateListNames])

    return (
        <>
            <button
                onClick={() => {
                    setIsShow(true);
                }}
                type='button'
                className='flex w-full justify-between items-center px-10px py-8px rounded-[5px] mt-4px h-42px'
            >
                <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                    <ModifyIcon className='mr-10px'/>
                    <span>{
                        data.cate.length !== 0 ?
                        '카테고리 수정' : '카테고리 추가'
                    }</span>
                </div>
            </button>
            <Transition appear show={isShow} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-30"
                    onClose={() => {
                        setAddCateValue('');
                        updateManyCate();
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-40"/>
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div
                            className="close-modal-background
                            flex min-h-full items-center justify-center p-4 text-center"
                        >
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="w-[300px] relative transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                                    <div className='relative h-[430px] w-full'>
                                        <CustomScroller>
                                            <div className='p-16px w-full h-full'>
                                                <p className="text-zete-dark-400">
                                                    카테고리 수정
                                                </p>
                                                <div className='py-16px px-8px text-15'>
                                                    <form
                                                        onSubmit={addCate}
                                                        className='flex items-center'
                                                    >
                                                        <>
                                                            <ModifyIcon className='min-w-[22px] mr-16px'/>
                                                        </>
                                                        <>
                                                            <input
                                                                placeholder='새 카테고리 만들기'
                                                                onChange={addCateValChange}
                                                                value={addCateValue}
                                                                className='placeholder:text-zete-dark-300 placeholder:font-thin pb-5px border-b border-zete-memo-border text-zete-dark-300 w-full'
                                                            />
                                                        </>
                                                        <button type='submit'
                                                                className='flex justify-center items-center rounded-full p-2px ml-8px hover:bg-zete-light-gray-200'>
                                                            <CatePlusIcon className='fill-zete-dark-100'/>
                                                        </button>
                                                    </form>
                                                    <ul className='text-zete-dark-200 grid gap-16px py-20px'>
                                                        {newCateListNames?.map((val,idx) => {
                                                            const cateId = newCateList[idx].cateId;
                                                            return (
                                                                <li key={idx}>
                                                                    <form
                                                                        onSubmit={(event) => {
                                                                            updateOneCate({event, val, cateId});
                                                                        }}
                                                                        className='flex items-center'
                                                                    >
                                                                        <>
                                                                            <FillCategoryIcon className='relative -left-3px fill-zete-dark-100 mr-10px' onClick={() => console.log(newCateListNames)}/>
                                                                        </>
                                                                        <input
                                                                            placeholder='수정할 태그를 입력해주세요.'
                                                                            value={val}
                                                                            onChange={(event) => handleUpdateName(idx, event)}
                                                                            className='font-medium w-full flex items-center'
                                                                        />
                                                                        <button
                                                                            type='button'
                                                                            className='relative group p-6px rounded-full hover:bg-zete-light-gray-200 -right-2px'
                                                                            onClick={() => {
                                                                                setGetCateId(cateId)
                                                                                setIsAgreeShow(true);
                                                                            }}
                                                                        >
                                                                            <DeleteIcon className='fill-zete-dark-100 group-hover:fill-black'/>
                                                                        </button>
                                                                    </form>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CustomScroller>
                                    </div>
                                    <div
                                        className="w-full flex justify-end p-1 py-16px pr-14px border-t border-zete-memo-border">
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                if (categories.some(cate => cate.cateName === addCateValue)) return alert('새 카테고리 이름이 기존 카테고리 이름과 중복됩니다.')
                                                addCate(e);
                                                updateManyCate();
                                            }}
                                            className='text-15 font-normal text-zete-dark-500 py-8px px-22px hover:bg-zete-light-gray-200 rounded-[4px]'
                                        >
                                            완료
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={isAgreeShow} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="relative z-40"
                    onClose={() => setIsAgreeShow(false)}
                    open={isAgreeShow}
                    initialFocus={deleteButtonRef}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-40"/>
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div
                            className="close-modal-background
                                            flex min-h-full items-center justify-center p-4 text-center"
                        >
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="relative transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all rounded-[5px]">
                                    <article className='p-16px font-light text-zete-dark-500'>
                                        <h1>
                                            카테고리를 삭제하면 카테고리에 존재하는 모든 메모가 삭제됩니다.
                                        </h1>
                                        <p>
                                            계속하시려면
                                            <span className='mr-2px text-blue-500 font-normal'> 삭제</span>
                                            를 눌러주세요.
                                        </p>
                                    </article>
                                    <div className="w-full flex justify-end p-1 py-16px pr-14px">
                                        <button
                                            type='button'
                                            onClick={() => setIsAgreeShow(false)}
                                            className='text-15 font-normal text-zete-dark-500 py-6px px-20px hover:bg-zete-light-gray-200 rounded-[4px] mr-12px'
                                        >
                                            취소
                                        </button>
                                        <button
                                            ref={deleteButtonRef}
                                            type='button'
                                            onClick={handleDelete}
                                            className='text-15 font-normal text-blue-500 py-6px px-20px hover:bg-zete-light-gray-200 rounded-[4px]'
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}