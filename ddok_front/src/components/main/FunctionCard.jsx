import React, { useRef, useState } from 'react'
import { styled } from 'styled-components';
import Typo from '@components/Typography';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Card1  from '/images/main5.png'
import Card2  from '/images/main6.png'
import Card3  from '/images/main7.png'

import './style.css';

const CardFir = styled.div`
    width: 877px;
    height: 317px;
    border-radius: 20px;
    padding: 2px 15px;
    background:linear-gradient(90deg, #FDFFA1, #9C84FF);
    display: flex;
    padding: 50px 80px;
    justify-content: flex-start;
    gap: 80px;
    text-align: start;
`;

const CardSec = styled.div`
    width: 877px;
    height: 317px;
    border-radius: 20px;
    padding: 2px 15px;
    background:linear-gradient(90deg, #9C84FF, #FFBCF0);
    display: flex;
    padding: 50px 80px;
    justify-content: flex-start;
    gap: 50px;
    text-align: start;
`;

const CardThi = styled.div`
    width: 877px;
    height: 317px;
    border-radius: 20px;
    padding: 2px 15px;
    background:linear-gradient(90deg, #FFBCF0, #FDFFA1);
    display: flex;
    padding: 50px 80px;
    justify-content: flex-start;
    gap: 50px;
    text-align: start;
`;
function FunctionCard() {
    return (
        <>
            <Swiper
                slidesPerView={'1.4'}
                // centeredSlides={true}
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination]}
                className="mySwiper"
            >

                <SwiperSlide>
                    <CardFir className='w-[877px] h-[317px]'>
                        <div className='w-[35%]'>
                        <img src={Card1} />
                        </div>
                        <div>
                            <div className='mb-[20px]'>
                                <Typo title={'가상 면접관 '} type={'body1'} />
                            </div>
                            <Typo title={'메타휴먼 가상면접관과의 '} type={'body2'} />
                            <Typo title={'모의면접을 통해 실제 면접관과  '} type={'body2'} />
                            <Typo title={'대화하는 연습을 해보세요! '} type={'body2'} />
                        </div>
                    </CardFir>
                </SwiperSlide>
                <SwiperSlide>
                    <CardSec className='w-[877px] h-[317px]'>
                    <div className='w-[37%]'>
                        <img src={Card3}/>
                        </div>
                        <div>
                            <div className='mb-[20px]'>
                                <Typo title={'면접 태도 분석 '} type={'body1'} />
                            </div>
                            <Typo title={'답변 내용, 음성, 시선, 자세 분석을'} type={'body2'} />
                            <Typo title={'진행하여 더 나은 면접 태도를  '} type={'body2'} />
                            <Typo title={'갖추기 위한 분석 결과를 알려줘요! '} type={'body2'} />
                        </div>
                    </CardSec>
                </SwiperSlide>
                <SwiperSlide>
                    <CardThi className='w-[877px] h-[317px]'>
                    <div className='w-[35%]'>
                        <img src={Card2} />
                        </div>
                        <div>
                            <div className='mb-[20px]'>
                                <Typo title={'맞춤형 피드백 제공 '} type={'body1'} />
                            </div>
                            <Typo title={'모의 면접 결과를 바탕으로 '} type={'body2'} />
                            <Typo title={'개별 맞춤형 피드백 사항을 제공해요. '} type={'body2'} />
                            <Typo title={'똑부러진 취업을 위한 한 발자국! '} type={'body2'} />
                        </div>
                    </CardThi>
                </SwiperSlide>
            </Swiper>
        </>
    )
}

export default FunctionCard