import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import s from './Footer.scss';
import Link from '../Link';

export default function Footer() {
  useStyles(s);

  return (
    <footer className={s.root}>
      <div className={s.container}>
        <span className={s.text}>© Amazing Products</span>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/">
          Home
        </Link>
        <span className={s.spacer}>·</span>
        <Link className={s.link} to="/privacy">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
