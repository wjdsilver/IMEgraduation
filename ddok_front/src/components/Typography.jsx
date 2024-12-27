import React, { useEffect } from 'react'

export default function Typography({title, type, m=0}) {
    const render = () => {
        if(type === 'heading1'){
            return <div className={`text-[15px] font-bold m-[${m}px] leading-[150%]`}>{title}</div>
        } 
        else if(type === 'body1'){
            return <div className={`text-[40px] font-bold m-[${m}px] leading-[150%]`}>{title}</div>
        } 
        else if(type === 'body2'){
            return <div className={`text-[24px] m-[${m}px]`}>{title}</div>
        } 
        else if(type === 'body4'){
            return <div className={`text-[35px]  font-bold m-[${m}px]`}>{title}</div>
        } 
        else if(type === 'body5'){
            return <div className={`text-[36px]  m-[${m}px]`}>{title}</div>
        } 
        else if(type === 'body7'){
            return <div className={`text-[28px] font-bold m-[${m}px]`}>{title}</div>
        } 
        else if(type === 'body8'){
            return <div className={`text-[24px] font-semibold m-[${m}px]`}>{title}</div>
        } 
        else if(type === 'body9'){
            return <div className={`text-[16px] font-semibold m-[${m}px] leading-[150%]`}>{title}</div>
        } 
        else if(type === 'body10'){
            return <div className={`text-[16px]  m-[${m}px] leading-[150%]`}>{title}</div>
        } 
        else if(type === 'small3'){
            return <div className={`text-[17px]  m-[${m}px] leading-[150%]`}>{title}</div>
        } 
        else if(type === 'small2'){
            return <div className={`text-[18px]  font-semibold m-[${m}px] leading-[150%]`}>{title}</div>
        } 
        else if(type === 'passwordError'){
            return <div className={`text-[15px]  m-[${m}px] leading-[150%] text-[#ff7979]`}>{title}</div>
        } 
    }

    return (
        <>
            {render()}
        </>
    )
}