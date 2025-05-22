import React from 'react';

interface LogoProps {
  onClick?: () => void;
  className?: string;
}

const fontFace = `
  @font-face {
    font-family: '양진체';
    src: url('https://fastly.jsdelivr.net/gh/supernovice-lab/font@0.9/yangjin.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
`;

const Logo = ({ onClick, className }: LogoProps) => {
  return (
    <>
      <style>{fontFace}</style>
      <h1
        className={`text-black cursor-pointer ${className}`}
        style={{ fontFamily: '양진체' }}
        onClick={onClick}
      >
        페이
        <span className="inline-block ml-1 -rotate-20">득</span>
      </h1>
    </>
  );
};

export { Logo };
