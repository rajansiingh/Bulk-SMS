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
import _ from 'lodash';
// import PropTypes from 'prop-types';
import s from './Home.scss';
import Card from '../../components/Card/Card';

export default function Home() {
  useStyles(s);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>This is our Home Page</h1>
        {_.times(3, index => (
          <Card key={index} />
        ))}
      </div>
    </div>
  );
}

// Home.propTypes = {
// news: PropTypes.arrayOf(
//   PropTypes.shape({
//     title: PropTypes.string.isRequired,
//     link: PropTypes.string.isRequired,
//     content: PropTypes.string,
//   }),
// ).isRequired,
// };
