'use client'

import {ChangeEvent, FormEvent, useRef, useState} from "react";
import styled from "styled-components";
import {IoIosArrowForward} from "react-icons/io";
import axios from "axios";
import {PayloadProps} from "@/interface/payload";
import {useMutation} from "react-query";
import Image from 'next/image'

const Main = () => {
  const [ip, setIp] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [comment, setComment] = useState<string>('')
  const [nameError, setNameError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement | null>(null);
  const domainName = process.env.NEXT_PUBLIC_DOMAIN_NAME;

  const posting = async (payload: PayloadProps): Promise<void> => {
    try {
      const res = await axios.post('/api/dns', payload);
      setIsSuccess(res.data.success)
    } catch (err: any) {
      setErrorMessage(err.response.data.message);
    }
  };

  const {mutate, isLoading, isError} = useMutation((payload: PayloadProps) => posting(payload));

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    const payload: PayloadProps = {
      content: ip,
      name: name,
      proxied: true,
      type: "A",
      comment: comment,
      ttl: 3600
    }

    mutate(payload)
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const regex = /^[a-zA-Z0-9]*$/;

    if (regex.test(event.target.value)) {
      setName(event.target.value);
      setNameError(false)
    } else {
      setNameError(true)
    }
  };

  const handleInputClick = (): void => {
    inputRef.current && inputRef.current.focus();
  };

  return (
    <>
      <main>
        {
          isSuccess ?
            <SuccessContainer>
              <Image src='/check.svg' className="check-logo" alt="React logo" width={10000} height={10000} priority={true}/>
              <div className={'text-1'}>DNS Record generated successfully.</div>
              <div className={'text-2'}>Visit page ? <a href={`https://${name + '.' + domainName}`}>{`https://${name + '.' + domainName}`}</a></div>
            </SuccessContainer>:
          <>
            <div>
              <Image src='/cloudflare.svg' className="logo" alt="React logo" width={10000} height={10000} priority={true}/>
            </div>
            <h1>Manage DNS records of {domainName}</h1>

            <div className={'info'}>
              <span>{name.length ? name + '.' + domainName : '[name]'}</span> points to
              <span> {ip.length ? ip : '[IPv4 address]'}</span>
              <br/>and has its traffic proxied through Cloudflare.
            </div>

            <form onSubmit={handleSubmit}>
              <div className={'input-container outer-input-container'}>
                <input required={true} placeholder={'IPv4 Address (ex) 118.231.234.214'} value={ip} minLength={7}
                       maxLength={15} onChange={e => setIp(e.target.value)}/>
              </div>
              <div className={'input-container inner-input-container'}>
                <div className={'inner-div'} onClick={handleInputClick}>
                  <InnerInput required={true} placeholder={'Name'} value={name} $length={name.length} maxLength={16}
                              minLength={1} onChange={handleNameChange} ref={inputRef}/>
                  <span className="inner-text">{'.' + domainName}</span>
                </div>

                <ErrorAlert $show={nameError}>Only English and numbers allowed !</ErrorAlert>
              </div>

              <div className={'input-container outer-input-container'}>
                <input placeholder={'Comment (Not required)'} value={comment}
                       onChange={e => setComment(e.target.value)}/>
              </div>

              <div className={'input-container'}>
                <button type={'submit'}>
                  {
                    isLoading ? <>Loading...</> :
                      <>Submit <IoIosArrowForward/></>
                  }
                </button>

                <ErrorAlert $thick={true} $show={errorMessage.length > 0}>{errorMessage}</ErrorAlert>
              </div>
            </form>
          </>
        }
      </main>
    </>
  )
}

export default Main

const ErrorAlert = styled.div<{ $show: boolean; $thick?: boolean }>`
  opacity: ${({$show}) => $show ? '1' : '0'};
  color: #F48120;
  transition: opacity .3s;
  padding: .5em;
  text-align: left;
  font-size: ${({$thick}) => $thick ? '20px' : '16px'};
`

const InnerInput = styled.input<{ $length: number }>`
  width: ${({$length}) => `${$length * 10}px`};
  min-width: 40px;
  max-width: 330px;
  height: 100%;

  &:focus {
    outline: none;
  }
`
const SuccessContainer = styled.div`
  * {
    transition: all .3s;
  }
  
  .check-logo {
    margin: auto;
    height: 20em;
    width: 90%;
  }

  .text-1 {
    font-size: 30px;
  }

  .text-2 {
    margin-top: 1em;
    font-size: 25px;

    & > a {
      text-decoration: none;
      color: #F48120;
    }
  }
  
  @media (max-width: 700px) {
    .check-logo {
      height: 17em;
    }

    .text-1 {
      font-size: 26px;
    }

    .text-2 {
      margin-top: 1em;
      font-size: 21px;
    }
  }

  @media (max-width: 500px) {
    .check-logo {
      height: 12em;
    }

    .text-1 {
      font-size: 18px;
    }

    .text-2 {
      margin-top: 1em;
      font-size: 15px;
    }
  }
`