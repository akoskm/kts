import React from 'react';
import register from './services/register';
import activate from './services/activate';
import signin from './services/signin';
import signout from './services/signout';
import { profileApi } from './services/profile';
import { pageApi } from './services/page';
import { albumApi } from './services/album';
import { searchApi } from './services/search';
import { renderToString } from 'react-dom/server';
import { routes } from './routes';
import { match, RoutingContext } from 'react-router';

export default (app, upload) => {

  /* non-react routes */
  app.post('/api/register', register);
  app.post('/api/activate', activate);
  app.post('/api/login', signin);
  app.post('/api/logout', signout);
  app.get('/api/profile', profileApi.profile);

  app.post('/api/pages', pageApi.createPage);
  app.get('/api/pages', pageApi.getPages);
  app.get('/api/pages/:nameslug', pageApi.findPage);

  app.get('/api/pages/:nameslug/photos', pageApi.getPhotos);
  app.post('/api/pages/:nameslug/photos', upload.single('file'), pageApi.uploadPhoto);
  app.delete('/api/pages/:nameslug/photos/:photoid', pageApi.deletePhoto);
  app.put('/api/pages/:nameslug/photos/:photoid', pageApi.updatePhoto);

  app.get('/api/pages/:nameslug/albums', albumApi.getAlbums);
  app.post('/api/pages/:nameslug/albums', albumApi.createAlbum);
  app.put('/api/pages/:nameslug/albums/:albumid', albumApi.updateAlbum);

  app.get('/api/search', searchApi.filterPhotos);

  /* main router for reactjs components, supporting both client and server side rendering*/
  let sendHtml = function (res, props, context) {
    const markup = renderToString(<RoutingContext {...props} params={{ context }}/>);
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>KTS</title>
        <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,500' rel='stylesheet' type='text/css'>
        <meta name=viewport content="width=device-width, initial-scale=1">
      </head>
      <script>
        window.APP_STATE = '${context}';
      </script>
      <body>
        <div id="app">${markup}</div>
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
    `);
  };

  app.get('*', (req, res, next) => {
    match({ routes, location: req.url }, (err, redirectLocation, props) => {
      if (err) {
        res.status(500).send(err.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (props) {
        let context = '';

        if (props.params.nameslug) {
          pageApi._findPage(props.params.nameslug, app.logger, function (err, doc) {
            context = JSON.stringify(doc);
            sendHtml(res, props, context);
          });
        } else {
          sendHtml(res, props, context);
        }

      } else {
        res.sendStatus(404);
      }
    });
  });
};
