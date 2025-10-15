import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { certificateId } = await req.json();

    if (!certificateId) {
      throw new Error('Certificate ID is required');
    }

    // Fetch certificate data
    const { data: certificate, error: certError } = await supabaseClient
      .from('certificates')
      .select(`
        *,
        student:student_id(full_name, email),
        teacher:teacher_id(full_name)
      `)
      .eq('id', certificateId)
      .single();

    if (certError) throw certError;

    // Generate HTML for certificate (simplified version - you can enhance with better design)
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page { size: A4 landscape; margin: 0; }
          body { 
            margin: 0; 
            padding: 60px; 
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            background: white;
            padding: 80px;
            border: 20px solid #FFD700;
            box-shadow: 0 0 30px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 1000px;
            position: relative;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 40px;
            left: 40px;
            right: 40px;
            bottom: 40px;
            border: 2px solid #FFD700;
            pointer-events: none;
          }
          h1 { 
            color: #667eea; 
            font-size: 48px; 
            margin: 0 0 20px 0;
            text-transform: uppercase;
            letter-spacing: 3px;
          }
          h2 { 
            color: #333; 
            font-size: 24px; 
            margin: 0 0 40px 0;
            font-weight: normal;
          }
          .student-name {
            font-size: 42px;
            color: #764ba2;
            margin: 30px 0;
            font-weight: bold;
            text-transform: capitalize;
          }
          .description {
            font-size: 18px;
            color: #555;
            margin: 30px 0;
            line-height: 1.6;
          }
          .details {
            margin: 40px 0;
            font-size: 16px;
            color: #666;
          }
          .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-around;
          }
          .signature {
            text-align: center;
          }
          .signature-line {
            width: 200px;
            border-top: 2px solid #333;
            margin: 0 auto 10px;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #999;
          }
          .verification {
            margin-top: 20px;
            padding: 15px;
            background: #f0f0f0;
            border-radius: 8px;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>Certificate of ${certificate.certificate_type}</h1>
          <h2>This is to certify that</h2>
          
          <div class="student-name">${certificate.student?.full_name || 'Student'}</div>
          
          <div class="description">
            ${certificate.description || `has successfully completed the requirements for ${certificate.title}`}
          </div>

          <div class="details">
            ${certificate.cefr_level ? `<p><strong>CEFR Level:</strong> ${certificate.cefr_level}</p>` : ''}
            ${certificate.score_achieved ? `<p><strong>Score Achieved:</strong> ${certificate.score_achieved}%</p>` : ''}
            ${certificate.hours_completed ? `<p><strong>Hours Completed:</strong> ${certificate.hours_completed} hours</p>` : ''}
            ${certificate.skills_demonstrated?.length ? `<p><strong>Skills Demonstrated:</strong> ${certificate.skills_demonstrated.join(', ')}</p>` : ''}
          </div>

          <div class="signature-section">
            <div class="signature">
              <div class="signature-line"></div>
              <div><strong>${certificate.teacher?.full_name || 'Instructor'}</strong></div>
              <div>Teacher</div>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <div><strong>${new Date(certificate.issue_date).toLocaleDateString()}</strong></div>
              <div>Date</div>
            </div>
          </div>

          <div class="verification">
            <strong>Certificate Number:</strong> ${certificate.certificate_number}<br>
            <strong>Verification Code:</strong> ${certificate.verification_code}
          </div>

          <div class="footer">
            EnglEuphoria Language Academy<br>
            www.engleuphoria.com
          </div>
        </div>
      </body>
      </html>
    `;

    // Return HTML for now - in production, you'd convert this to PDF using a service
    // For actual PDF generation, you can use services like:
    // - Browserless (https://www.browserless.io/)
    // - PDFShift (https://pdfshift.io/)
    // - Or deploy a headless Chrome instance

    return new Response(
      JSON.stringify({
        html: certificateHTML,
        certificate: certificate,
        message: 'Certificate HTML generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error generating certificate:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});