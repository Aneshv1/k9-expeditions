import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const prerender = false;

const supabaseUrl = import.meta.env.SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';
const resendApiKey = import.meta.env.RESEND_API_KEY || '';
const notifyFrom = import.meta.env.NOTIFY_FROM || 'K9 Expeditions Leads <leads@k9expeditions.com>';
const notifyTo = (import.meta.env.NOTIFY_TO || 'info@k9expeditions.com,contact@k9academy.ca').split(',').map((e: string) => e.trim());

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, dog_info, service, message } = body;

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const results = { supabase: false, email: false };

    if (supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { error } = await supabase.from('leads').insert({
          owner_name: name,
          email,
          phone,
          dog_name: dog_info || null,
          service: service || 'inquiry',
          challenge: message || null,
          stage: 'new',
          priority: 'normal',
          source: 'k9_expeditions',
        });

        if (!error) results.supabase = true;
        else console.error('Supabase error:', error.message);
      } catch (e) {
        console.error('Supabase insert failed:', e);
      }
    }

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const rows: Array<[string, string]> = [
          ['Name', name],
          ['Email', email],
          ['Phone', phone],
          ['Service', service || '—'],
          ['Dog', dog_info || '—'],
          ['Message', message || '—'],
        ];
        const html = `
          <h2 style="margin:0 0 16px;font-family:system-ui,sans-serif">New lead from K9 Expeditions</h2>
          <table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">
            ${rows
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top"><strong>${k}</strong></td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(String(v))}</td></tr>`
              )
              .join('')}
          </table>
          <p style="margin-top:16px;color:#888;font-size:12px;font-family:system-ui,sans-serif">Reply to this email to respond directly to the lead.</p>
        `;
        const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

        const { error } = await resend.emails.send({
          from: notifyFrom,
          to: notifyTo,
          replyTo: email,
          subject: `New lead: ${name} — ${service || 'inquiry'}`,
          html,
          text,
        });

        if (!error) results.email = true;
        else console.error('Resend error:', error);
      } catch (e) {
        console.error('Resend send failed:', e);
      }
    }

    return new Response(JSON.stringify({ success: true, ...results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
