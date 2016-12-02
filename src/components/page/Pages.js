import React from 'react'; // eslint-disable-line no-unused-vars

const Pages = ({pages}) =>
  <div>
    <h4>Your Pages</h4>
    {pages.map(function (page, i) {
      return (
        <div>
          <a index={i}
            href={'/page/' + page.nameslug}
          >
          {page.name}
          </a>
        </div>
      );
    })}
  </div>

export default Pages;
