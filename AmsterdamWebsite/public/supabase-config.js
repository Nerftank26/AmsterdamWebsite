/* ================================================================
   supabase-config.js — Shared Supabase Configuration
   Team 3 | CSCI 4750 Systems Analysis and Design

   Include this file BEFORE page-specific script.js on every page.
   Provides: SUPABASE_URL, SUPABASE_KEY, supabaseFetch(), supabaseInsert()
   ================================================================ */

const SUPABASE_URL = 'https://ffcxtiqxrlkjfccrunzk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmY3h0aXF4cmxramZjY3J1bnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMzM3NzMsImV4cCI6MjA5MTYwOTc3M30.pTiuFl_qNEi6gqMcstJDbWeogjLWfXm5SNkCE-AszKg';

const SUPABASE_HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json'
};

/* ── Generic fetch helper ── */
async function supabaseFetch(table, query) {
    var url = SUPABASE_URL + '/rest/v1/' + table + '?select=*';
    if (query) url += query;

    var response = await fetch(url, { headers: SUPABASE_HEADERS });

    if (!response.ok) {
        throw new Error(table + ': HTTP ' + response.status);
    }
    return response.json();
}

/* ── Generic insert helper ── */
async function supabaseInsert(table, data) {
    var response = await fetch(SUPABASE_URL + '/rest/v1/' + table, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        var err = await response.json();
        throw new Error(err.message || 'Insert failed: ' + response.status);
    }
    return response.json();
}
