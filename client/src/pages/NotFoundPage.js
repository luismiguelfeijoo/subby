import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Typography } from 'antd';
const { Title, Text } = Typography;
import '../../public/css/wave.css';

export const NotFoundPage = withRouter(({ history }) => {
  return (
    <>
      <div className='header'>
        <div className='inner-header flex'>
          <svg
            version='1.1'
            className='logo'
            baseProfile='tiny'
            id='Layer_1'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            x='0px'
            y='0px'
            viewBox='0 0 500 500'
            xmlSpace='preserve'
          >
            <path
              fill='#FFFFFF'
              stroke='#000000'
              strokeWidth='10'
              strokeMiterlimit='10'
              d='M57,283'
            />
          </svg>
          <div className='inner-flex'>
            <Text code style={{ color: '#fff' }}>
              404 PAGE NOT FOUND
            </Text>
            <Title style={{ color: '#fff', marginTop: '5px' }}>
              Since you're lost take this time to relax
            </Title>
          </div>
        </div>

        <div>
          <svg
            className='waves'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            viewBox='0 24 150 28'
            preserveAspectRatio='none'
            shapeRendering='auto'
          >
            <defs>
              <path
                id='gentle-wave'
                d='M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z'
              />
            </defs>
            <g className='parallax'>
              <use
                xlinkHref='#gentle-wave'
                x='48'
                y='0'
                fill='rgba(255,255,255,0.7'
              />
              <use
                xlinkHref='#gentle-wave'
                x='48'
                y='3'
                fill='rgba(255,255,255,0.5)'
              />
              <use
                xlinkHref='#gentle-wave'
                x='48'
                y='5'
                fill='rgba(255,255,255,0.3)'
              />
              <use xlinkHref='#gentle-wave' x='48' y='7' fill='#fff' />
            </g>
          </svg>
        </div>
      </div>

      <div className='content flex'>
        <Text>
          When you're ready you can always{' '}
          <Link onClick={() => history.goBack()}>go back</Link>
        </Text>
      </div>
    </>
  );
});
