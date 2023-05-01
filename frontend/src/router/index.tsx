import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Home} from "../modules/intro/pages";
import {MemoLayout} from "../modules/main/layout";
import {ProfileModify} from "../modules/main/pages/profileModify";
import {PrivateElement} from "./privateElement";
import {Profile} from "../modules/main/pages/profile";
import {MemoMain} from "../modules/main/pages";
import {HomeLayout} from "../modules/intro/layout";
import {Service} from "../modules/intro/pages/service";
import {Guide} from "../modules/intro/pages/guide";
import {PayNotice} from "../modules/intro/pages/paymentNotice";
import {UserExp} from "../modules/intro/pages/userExperience";
import {Notice} from "../modules/intro/pages/notice";
import {MemoInfoPopover} from "../modules/main/components/popovers/MemoInfoPopover";

export const Index = ()=> {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeLayout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="service" element={<Service/>}/>
                    <Route path="guide" element={<Guide/>}/>
                    <Route path="userExp" element={<UserExp/>}/>
                    <Route path="payNotice" element={<PayNotice/>}/>
                    <Route path="notice" element={<Notice/>}/>
                    <Route path="e" element={<MemoInfoPopover/>}/>
                </Route>

                <Route path="/memo/*" element={<PrivateElement><MemoLayout/></PrivateElement>}>
                    <Route index element={<MemoMain/>}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route path="profile/modify" element={<ProfileModify/>}/>
                </Route>
            </Routes>
        </Router>
    );
};