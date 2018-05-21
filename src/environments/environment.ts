// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'https://localhost:8080/trackforever', // TODO replace with local API
  mockBackend: false,
  firebaseConfig: {
    apiKey: 'AIzaSyBA71GS_jZvo9N2Qk3deEw89i1XxYLRZHs',
    authDomain: 'track-forever-b0adf.firebaseapp.com',
    databaseURL: 'https://track-forever-b0adf.firebaseio.com',
    storageBucket: 'track-forever-b0adf.appspot.com',
    projectId: 'track-forever-b0adf',
    messagingSenderId: '102665664344'
  }
};
