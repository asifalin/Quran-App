const https = require('https');
https.get('https://api.alquran.cloud/v1/surah/1/ar.alafasy', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log(Object.keys(json));
    if (json.data && json.data.ayahs && json.data.ayahs[0]) {
      console.log('ayah0 keys:', Object.keys(json.data.ayahs[0]));
      console.log('audio field', json.data.ayahs[0].audio || json.data.ayahs[0].audioSecondary || 'none');
    }
  });
}).on('error', e => console.error(e));
