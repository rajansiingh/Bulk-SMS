/**
 * Author : rajansingh
 * Created On : 14/07/20
 */
import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import s from './Card.scss';

export default function Card() {
  useStyles(s);

  return (
    <div className={s.root}>
      <div className={s.container}>Hii I am Card</div>
    </div>
  );
}
