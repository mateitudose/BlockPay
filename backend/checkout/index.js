const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabase = createClient(
    'https://ecozdwjnqcnxnyjfaxlm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3pkd2pucWNueG55amZheGxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NTE2NDQ4MywiZXhwIjoyMDAwNzQwNDgzfQ.UnseGYC4_ARBA2D7WeVcXoHpRyvce1kQQfY0UI-Lsss'
)

const resend = new Resend('re_8H11yqtV_7xzii1qU7dVSYBEQBV8G3mAg');

const sendEmail = async (email, content, product_name) => {
    try {
        const data = await resend.emails.send({
            from: 'Blockpay <orders@email.onblockpay.com>',
            to: email,
            subject: `Order confirmation - ${product_name}`,
            html:
                `
                    <!DOCTYPE html
                PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
            <html lang="en">

            <head></head>

            <body
                style="background-color:#ffffff;color:#24292e;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;">
                <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%"
                    style="max-width:37.5em;width:480px;margin:0 auto;padding:20px 0 48px">
                    <tr style="width:100%">
                        <td><img alt="Blockpay" src="https://i.ibb.co/V9Sn4c5/logo-dark-png.png"
                                width="231" height="57" style="display:block;outline:none;border:none;text-decoration:none" />
                            <p style="font-size:24px;line-height:1.25;margin:16px 0">
                                <strong>${email}</strong>, thank you for your purchase!
                            </p>
                            <table style="padding:24px;border:solid 1px #dedede;border-radius:5px;text-align:center" align="center"
                                border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <p style="font-size:14px;line-height:24px;margin:0 0 10px 0;text-align:left">Hey
                                                <strong>${email}</strong>! Here's your order
                                            </p>
                                            <p style="font-size:14px;line-height:24px;margin:0 0 10px 0;text-align:left">
                                                ${content}
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p style="font-size:14px;line-height:24px;margin:16px 0;text-align:center">
                                <a href="https://onblockpay.com" target="_blank"
                                    style="color:#0366d6;text-decoration:none;font-size:12px">Website</a>
                                ・
                                <a href="mailto:contact@onblockpay.com" target="_blank"
                                    style="color:#0366d6;text-decoration:none;font-size:12px">Contact support</a>
                            </p>
                            <p
                                style="font-size:12px;line-height:24px;margin:16px 0;color:#6a737d;text-align:center;margin-top:60px">
                                Blockpay, Inc. ・Arad ・Romania</p>
                        </td>
                    </tr>
                </table>
            </body>

            </html>
            `
        });
        console.log(data);
    }
    catch (error) {
        console.log(error);
    }
}


const invoices = supabase.channel('custom-update-channel')
    .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'invoices' },
        async (payload) => {
            if (payload.new.status === 'Confirmed' && payload.old.status !== 'Confirmed') {
                const email = payload.new.customer_email;
                const product_id = payload.new.product_id;
                const name = payload.new.product_name;
                let { data: product_content, error } = await supabase
                    .from('product_content')
                    .select('content')
                    .eq('id', product_id);
                if (error) {
                    console.log(error);
                }
                let content = product_content[0].content;
                console.log(email, content, name);
                await sendEmail(email, content, name);
            }
        }
    )
    .subscribe()
