exports.config = {
  globalStyle: 'src/global/app.css',
  copy: [
    { src: 'wasm' }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
