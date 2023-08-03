import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Home} from '../modules/intro/pages/Home.page';
import {MemoLayout} from '../modules/main/layout/Layout';
import {ProfileEdit} from '../modules/main/pages/ProfileEdit.page';
import {PrivateElement} from './PrivateElement';
import {Profile} from '../modules/main/pages/Profile.page';
import {Memo} from '../modules/main/pages/Memo.page';
import {HomeLayout} from '../modules/intro/layout/Layout';
import {Service} from '../modules/intro/pages/Service.page';
import {Guide} from '../modules/intro/pages/Guide.page';
import {PayNotice} from '../modules/intro/pages/PaymentNotice.page';
import {UserExp} from '../modules/intro/pages/UserExperience.page';
import {Notice} from '../modules/intro/pages/Notice.page';
import {MemoInfoPopover} from '../modules/main/components/popovers/MemoInfo.popover';

export const Router = ()=> {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={ <HomeLayout/> }>
                    <Route index element={ <Home/> }/>
                    <Route path='service' element={ <Service/> }/>
                    <Route path='guide' element={ <Guide/> }/>
                    <Route path='userExp' element={ <UserExp/> }/>
                    <Route path='payNotice' element={ <PayNotice/> }/>
                    <Route path='notice' element={ <Notice/> }/>
                    <Route path='e' element={ <MemoInfoPopover/> }/>
                </Route>

                <Route path='/memo/*' element={ <PrivateElement><MemoLayout/></PrivateElement> }>
                    <Route index element={ <Memo/> }/>
                    <Route path='profile' element={ <Profile/> }/>
                    <Route path='profile/modify' element={ <ProfileEdit/> }/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};