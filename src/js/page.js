'use strict';

import Menu from './menu';

new Menu({
  elem: document.querySelector('.menu')
});

// подключается динамически
document.querySelector('.page__header').onclick = function() {
  require.ensure([], function() {
    require('./header');
  });
};

