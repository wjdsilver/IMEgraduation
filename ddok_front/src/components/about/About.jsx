import React from 'react'
import Header from '@components/Header';
import styled from 'styled-components';
import Typo from '@components/Typography';
import Members from '/images/members.svg';
import Member1 from '/images/member1.svg';
import Member2 from '/images/member2.svg';
import Member3 from '/images/member3.svg';
import Member4 from '/images/member4.svg';
import Member5 from '/images/member5.svg';
import MainBg from '/images/memberBg.png';

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
z-index: -1;
`;

const MemberCard = styled.div`
background-color: rgb(255,255,255,0.3);
border-radius: 50px;
height: 212px;
`;

function About() {
    return (
        <>
            <Background />
            <Header />
            <BackgroundImage >
                <img src={MainBg} className='w-[100vw]' />
            </BackgroundImage>
            <img src={Members} className='mt-[100px] ml-[250px] mb-[50px]' />
            <div className='flex justify-center gap-[20px] text-[white] '>
                <MemberCard className='flex  w-[384px] justify-evenly items-center bg-[white]'>
                    <img src={Member1} />
                    <div className='w-[3px] h-[120px] mt-[10px] bg-[white]'></div>
                    <div className='mr-[20px]'>
                        <Typo title={'민유빈'} type={'body8'} />
                        <Typo title={'FRONTEND'} type={'body10'} />
                    </div>
                </MemberCard>
                <MemberCard className='flex  w-[384px] justify-evenly items-center bg-[white]'>
                    <img src={Member2} />
                    <div className='w-[3px] h-[120px] mt-[10px] bg-[white]'></div>
                    <div className='mr-[20px]'>
                        <Typo title={'김유정'} type={'body8'} />
                        <Typo title={'WEBDESIGN'} type={'body10'} />
                        <Typo title={'UNREAL'} type={'body10'} />
                    </div>
                </MemberCard>
            </div>
            <div className='flex justify-center gap-[20px] text-[white] mt-[30px]'>
                <MemberCard className='flex  w-[384px] justify-evenly items-center bg-[white]'>
                    <img src={Member5} />
                    <div className='w-[3px] h-[120px] mt-[10px] bg-[white]'></div>
                    <div className='mr-[20px]'>
                        <Typo title={'강이서'} type={'body8'} />
                        <Typo title={'AI'} type={'body10'} />
                        <Typo title={'BACKEND'} type={'body10'} />
                    </div>
                </MemberCard>
                <MemberCard className='flex  w-[384px] justify-evenly items-center bg-[white]'>
                    <img src={Member4} />
                    <div className='w-[3px] h-[120px] mt-[10px] bg-[white]'></div>
                    <div className='mr-[20px]'>
                        <Typo title={'김정은'} type={'body8'} />
                        <Typo title={'AI'} type={'body10'} />
                        <Typo title={'BACKEND'} type={'body10'} />
                    </div>
                </MemberCard>
            </div>
        </>
    )
}

export default About