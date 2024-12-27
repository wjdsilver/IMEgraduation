import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import AnswerFeedback from './AnswerFeedback';
import { useRecoilState } from 'recoil';
import { myAnalyzeAtom } from '@store/atom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import './swiperstyle.css';
import AnswerContent from './AnswerContent';

const RectBorder = styled.div`
    border: 2px solid black;
    margin: 20px 0;
    width: 110px;
    padding-left: 10px;
`;

const RedSpan = styled.span`
    color: #FF5A5A;
`;

const BlueSpan = styled.span`
    color: #5A8EFF;
`;

const RectBorder2 = styled.div`
    width: 210px;
    margin-bottom: 30px;
    padding-left: 10px;
    background-color: white;
    color: black;
`;
const FeedbackDetailBoxs = styled.div`
    font-size: 22px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    `;
const FeedbackBox = styled.div`
    padding: 60px ;
    border-radius: 40px;
    border: 2px solid white;
    color: white;
    margin-top: 50px;
`;
const FeedbackDetailBox = styled.div`
    box-shadow: 0 0 10px white;
    border-radius: 10px;
    padding: 30px;
    white-space: pre-wrap;
`;

function Answer({ }) {
    const [analyze, setAnalyze] = useRecoilState(myAnalyzeAtom);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <>
                    <AnswerFeedback />
            <Swiper
                pagination={{
                    type: 'fraction',
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >

                {analyze.responses.map((item, i) => {
                    if (item.response) {
                        return (
                            <SwiperSlide key={i}>
                                <AnswerContent answerIndex={i} />
                            </SwiperSlide>
                        )
                    }
                })}
         
            </Swiper>

        </>
    )
}

export default Answer