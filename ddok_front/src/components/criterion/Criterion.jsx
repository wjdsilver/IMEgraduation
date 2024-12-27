import React, { useState } from 'react'
import Header from '@components/Header';
import styled from 'styled-components';
import Typo from '@components/Typography'
import ComputerChat from './ComputerChat';
import UserChat from './UserChat';
import AnswerChat from './AnswerChat';
import SoundChat from './SoundChat';
import CriterionBg from '/images/criterionBg2.png'
import SightChat from './SightChat';

const Background = styled.div`
position: fixed;
width: 100%;
height: 100vh;     
background-image: linear-gradient(#000,#002A84);
background-repeat : no-repeat;
background-size : cover;
z-index: -2;
`;

const BackgroundImage = styled.div`
position: absolute;
width: 100%;
z-index: -1;
`;

function Criterion() {
    const [ chatList, setChatList ] = useState(['computer']); 
    
    const renderChat = (chatType) => {
        if (chatType == "computer"){
            return <ComputerChat setChatList={setChatList}/>
        }
        if (chatType == "user"){
            return <UserChat />
        }
        if (chatType == "answer"){
            return <AnswerChat setChatList={setChatList}/>
        }
        if (chatType == "sound"){
            return  <SoundChat setChatList={setChatList}/>
        }
        if (chatType == "sight"){
            return  <SightChat setChatList={setChatList}/>
        }
    }
       
    return (
        <>
            <Background />
            <Header />
            <BackgroundImage className=''>
                    <img src={CriterionBg} className='w-[100%] ' />
                </BackgroundImage>
            <div className=' w-[1214px] m-[auto]'>
            {
                chatList.map((item, i) => {
                    return renderChat(item)
                })
            }
            
            </div>
        </>
    )
}

export default Criterion