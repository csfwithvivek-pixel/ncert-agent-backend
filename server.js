const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = 'sk-ant-api03-dz_...xgAA'; // <-- sk-ant-api03-dz_...xgAA

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/ask', async (req, res) => {
  const { question, subject, cls, chapter, mode } = req.body;
  let system = `Aap NCERT aur RBSE expert teacher hain. Class: ${cls}, Vishay: ${subject}, Chapter: ${chapter || 'koi bhi'}.`;
  if (mode === 'diagram') system += ' ASCII diagram banayein aur explain karein.';
  else if (mode === 'rbse') system += ' RBSE exam tips dein: marks, definitions, questions, tricks.';
  else system += ' Saral Hindi mein jawab dein: concept → examples → summary.';

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 900, system, messages: [{ role: 'user', content: question }] })
    });
    const d = await r.json();
    if (d.error) return res.status(400).json({ error: d.error.message });
    res.json({ answer: d.content[0].text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => res.send('Server chal raha hai!'));
app.listen(3000, () => console.log('Ready!'));
