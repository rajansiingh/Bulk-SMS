/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import s from './Header.scss';
import Link from '../Link';
import Navigation from '../Navigation';
import logoUrl from './logo-small.png';
import logoUrl2x from './logo-small@2x.png';

export default function Header() {
  useStyles(s);
  return (
    <header className={s.root}>
      <div className={s.container}>
        <Navigation />
        <Link className={s.brand} to="/">
          <img
            src={logoUrl}
            srcSet={`${logoUrl2x} 2x`}
            width="38"
            height="38"
            alt="React"
          />
          <span className={s.brandTxt}>Amazing Products</span>
        </Link>
        <div className={s.banner}>
          <h1 className={s.bannerTitle}>Bulk SMS</h1>
          <p className={s.bannerDesc}>Reach your Customers with ease</p>
        </div>
      </div>
    </header>
  );
}
