// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());

// Configure allowed origin(s)
const ALLOWED_ORIGINS = ['https://steelcitykickball.github.io'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or curl
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS not allowed'), false);
  },
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Sheet IDs and names (same as your Apps Script constants)
const IDENTITY_SHEET_ID = '1x64wDxznREdSpEgzyQXSr61dqI7Nm4jpUt0gQgnxSXM';
const HOMEPAGE_SHEET_ID = '1bqcKpBFyJcbKfU_z1IfpomIXbnaPe63E_zS3EZ-I_mg';
const RULES_SHEET_ID    = '10L0lZ-vbUsoanWn7WDAlE4cTkF0TqxsfNzWMLvGA0Rw';
const IDENTITY_SHEET_NAME = 'Users';
const RULES_SHEET_NAME = 'League Rules Live';
const HOMEPAGE_SHEET_NAME = 'Homepage';

// Initialize Google Sheets client using Application Default Credentials
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient });
}

// Utility: read a single cell
async function readCell(sheets, spreadsheetId, range) {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return (res.data.values && res.data.values[0] && res.data.values[0][0]) || '';
}

// Utility: read a row range
async function readRow(sheets, spreadsheetId, range) {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return (res.data.values && res.data.values[0]) || [];
}

// GET endpoints
app.get('/', (req, res) => res.json({ status: 'ok' }));

app.get('/exec', async (req, res) => {
  const action = req.query.action || '';
  const sheets = await getSheetsClient();

  try {
    switch(action) {
      case 'ping':
        return res.json({ success: true });

      case 'getRules': {
        const text = await readCell(sheets, RULES_SHEET_ID, `${RULES_SHEET_NAME}!A1`);
        return res.json({ text: text || '' });
      }

      case 'getHomepageContent': {
        const row = await readRow(sheets, HOMEPAGE_SHEET_ID, `${HOMEPAGE_SHEET_NAME}!A2:H2`);
        return res.json({
          CommissionerMessage: row[0] || '',
          LeagueUpdates: row[1] || '',
          BannerHeadline: row[2] || '',
          GOTWTitle: row[3] || '',
          GOTWBlurb: row[4] || '',
          MVPName: row[5] || '',
          MVPTeam: row[6] || '',
          MVPBlurb: row[7] || ''
        });
      }

      case 'getUsers': {
        const range = `${IDENTITY_SHEET_NAME}!A:Z`;
        const resp = await sheets.spreadsheets.values.get({ spreadsheetId: IDENTITY_SHEET_ID, range });
        const values = resp.data.values || [];
        if (values.length < 1) return res.json({ users: [] });
        const headers = values[0];
        const users = values.slice(1).map(row => {
          const obj = {};
          headers.forEach((h, i) => obj[h] = row[i] || '');
          return obj;
        });
        return res.json({ users });
      }

      case 'fetchPlayers': {
        const team = req.query.team || '';
        const range = `${IDENTITY_SHEET_NAME}!A:Z`;
        const resp = await sheets.spreadsheets.values.get({ spreadsheetId: IDENTITY_SHEET_ID, range });
        const values = resp.data.values || [];
        if (values.length < 1) return res.json({ status: 'ok', players: [] });
        const headers = values[0];
        const idxTeam = headers.indexOf('PrimaryTeamID');
        const idxUserID = headers.indexOf('UserID');
        const idxNickname = headers.indexOf('Nickname');
        const idxJersey = headers.indexOf('JerseyNumber');
        const idxEmail = headers.indexOf('Email');
        const idxUserType = headers.indexOf('UserType');

        const players = [];
        for (let i = 1; i < values.length; i++) {
          if (values[i][idxTeam] === team) {
            players.push({
              UserID: values[i][idxUserID] || '',
              Nickname: values[i][idxNickname] || '',
              JerseyNumber: values[i][idxJersey] || '',
              Email: values[i][idxEmail] || '',
              UserType: values[i][idxUserType] || ''
            });
          }
        }
        return res.json({ status: 'ok', players });
      }

      case 'getProfile': {
        const email = (req.query.email || '').toLowerCase();
        const range = `${IDENTITY_SHEET_NAME}!A:Z`;
        const resp = await sheets.spreadsheets.values.get({ spreadsheetId: IDENTITY_SHEET_ID, range });
        const values = resp.data.values || [];
        if (values.length < 1) return res.json({ status: 'not_found', email });
        const headers = values[0];
        const emailCol = headers.indexOf('Email');
        const nameCol = headers.indexOf('Name');
        const avatarCol = headers.indexOf('AvatarUrl');
        for (let r = 1; r < values.length; r++) {
          if ((values[r][emailCol] || '').toLowerCase() === email) {
            return res.json({
              status: 'ok',
              email: values[r][emailCol] || '',
              name: values[r][nameCol] || '',
              avatarUrl: values[r][avatarCol] || ''
            });
          }
        }
        return res.json({ status: 'not_found', email });
      }

      case 'checkRole': {
        const email = (req.query.email || '').toLowerCase();
        const range = `${IDENTITY_SHEET_NAME}!A:Z`;
        const resp = await sheets.spreadsheets.values.get({ spreadsheetId: IDENTITY_SHEET_ID, range });
        const values = resp.data.values || [];
        if (values.length < 1) return res.json({ status: 'ok', role: 'player' });
        const headers = values[0];
        const emailCol = headers.indexOf('Email');
        const userTypeCol = headers.indexOf('UserType');
        for (let r = 1; r < values.length; r++) {
          if ((values[r][emailCol] || '').toLowerCase() === email) {
            return res.json({ status: 'ok', role: values[r][userTypeCol] || 'player' });
          }
        }
        return res.json({ status: 'ok', role: 'player' });
      }

      default:
        return res.status(400).json({ status: 'error', message: 'Unknown action' });
    }
  } catch (err) {
    console.error('exec error', err);
    return res.status(500).json({ status: 'error', message: 'Server error', detail: String(err) });
  }
});

// POST endpoints for writes (protected by a simple token)
const WRITE_TOKEN = process.env.WRITE_TOKEN || ''; // set in Cloud Run env

app.post('/exec', async (req, res) => {
  const action = req.body.action;
  const token = req.headers['x-write-token'] || req.query.token;
  if (!WRITE_TOKEN || token !== WRITE_TOKEN) {
    return res.status(403).json({ status: 'error', message: 'Unauthorized' });
  }

  const sheets = await getSheetsClient();
  try {
    switch(action) {
      case 'saveRules': {
        const text = req.body.text || '';
        await sheets.spreadsheets.values.update({
          spreadsheetId: RULES_SHEET_ID,
          range: `${RULES_SHEET_NAME}!A1`,
          valueInputOption: 'RAW',
          requestBody: { values: [[text]] }
        });
        return res.json({ success: true });
      }

      case 'updateHomepageContent': {
        const fields = [
          'CommissionerMessage',
          'LeagueUpdates',
          'BannerHeadline',
          'GOTWTitle',
          'GOTWBlurb',
          'MVPName',
          'MVPTeam',
          'MVPBlurb'
        ];
        // read header row to find columns
        const headerResp = await sheets.spreadsheets.values.get({ spreadsheetId: HOMEPAGE_SHEET_ID, range: `${HOMEPAGE_SHEET_NAME}!1:1` });
        const header = (headerResp.data.values && headerResp.data.values[0]) || [];
        const updates = [];
        fields.forEach((f, i) => {
          if (Object.prototype.hasOwnProperty.call(req.body, f)) {
            const col = header.indexOf(f) + 1;
            if (col > 0) updates.push({ range: `${HOMEPAGE_SHEET_NAME}!${col}2`, value: req.body[f] });
          }
        });
        // batch update
        if (updates.length) {
          const data = updates.map(u => ({ range: u.range, values: [[u.value]] }));
          await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: HOMEPAGE_SHEET_ID,
            requestBody: { valueInputOption: 'RAW', data }
          });
        }
        return res.json({ status: 'ok', message: 'Homepage updated' });
      }

      case 'updateCaptainStatus': {
        const changes = req.body.changes || [];
        if (!Array.isArray(changes)) return res.status(400).json({ status: 'error', message: 'Invalid changes' });
        // read identity sheet
        const resp = await sheets.spreadsheets.values.get({ spreadsheetId: IDENTITY_SHEET_ID, range: `${IDENTITY_SHEET_NAME}!A:Z` });
        const values = resp.data.values || [];
        if (values.length < 1) return res.json({ status: 'error', message: 'No identity data' });
        const headers = values[0];
        const emailCol = headers.indexOf('Email');
        const userTypeCol = headers.indexOf('UserType');
        const emailToRow = {};
        for (let r = 1; r < values.length; r++) {
          const email = values[r][emailCol];
          if (email) emailToRow[email] = r + 1;
        }
        let updated = 0;
        const batch = [];
        changes.forEach(ch => {
          const row = emailToRow[ch.Email];
          if (row) {
            const range = `${IDENTITY_SHEET_NAME}!${userTypeCol+1}${row}`;
            batch.push({ range, values: [[ch.UserType]] });
            updated++;
          }
        });
        if (batch.length) {
          await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: IDENTITY_SHEET_ID,
            requestBody: { valueInputOption: 'RAW', data: batch }
          });
        }
        return res.json({ status: 'success', updated });
      }

      default:
        return res.status(400).json({ status: 'error', message: 'Unknown POST action' });
    }
  } catch (err) {
    console.error('post exec error', err);
    return res.status(500).json({ status: 'error', message: 'Server error', detail: String(err) });
  }
});

// Start server (Cloud Run sets PORT)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

