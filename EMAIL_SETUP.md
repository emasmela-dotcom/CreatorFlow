# Email for CreatorFlow365

You want mail sent **to** support@creatorflow365.com to land in **your** inbox. That’s done with **forwarding**, not Resend.

---

## Complete setup with ImprovMX (checklist)

Do these in order. When done, mail to **support@creatorflow365.com** will arrive in your personal inbox.

| Step | Action | Done |
|------|--------|------|
| 1 | Go to **[improvmx.com](https://improvmx.com)** and sign up (free). | ☐ |
| 2 | Add domain **creatorflow365.com**. | ☐ |
| 3 | Add alias **support** and set “Forward to” → **your personal email** (e.g. Gmail). | ☐ |
| 4 | In ImprovMX, copy the **MX records** (and any TXT they show). | ☐ |
| 5 | Open **DNS** where creatorflow365.com is managed (registrar or Cloudflare). | ☐ |
| 6 | Add ImprovMX’s MX records. (Often: delete or lower priority of existing MX for the domain, then add ImprovMX’s—they’ll show the exact values.) | ☐ |
| 7 | Save DNS and wait 5–15 min (sometimes up to an hour). | ☐ |
| 8 | **Test:** send an email **to** support@creatorflow365.com from another address; it should appear in your personal inbox. | ☐ |

**If you’re not sure where DNS is:** see [If you don’t know where the domain DNS is](#if-you-dont-know-where-the-domain-dns-is) below.

---

## What you need: forward support@ to your email

1. **Where is creatorflow365.com registered?**  
   (Who do you pay for the domain? e.g. Namecheap, GoDaddy, Google Domains, Cloudflare, etc.)

2. **Turn on email forwarding there**  
   - Log in to that company’s site.  
   - Find **Email** or **Forwarding** or **Mail** (often under the domain or “Email” in the menu).  
   - Add a forward: **support@creatorflow365.com** → **your personal email** (the one you actually use, e.g. Gmail).

3. **Test**  
   - Send a test email **to** support@creatorflow365.com from another address.  
   - It should show up in your personal inbox.

After that, anything sent to support@creatorflow365.com (contact forms, people emailing support, etc.) will go to you.

---

## What the app does

- **Signup welcome** – The app can send a welcome email to the new user. That uses Resend (an optional “app sends from support@” setup). If you don’t set that up, signup still works; they just won’t get an automated welcome email.
- **You getting signup alerts** – The homepage form already sends signup notifications to partners.clearhub@gmail.com. If you want those to go to support@ instead (so they forward to you), we can change the form to send to support@creatorflow365.com.

---

## Free 3rd‑party forwarding (support@ → your email)

You don’t need to use your domain registrar. These are free and work with any domain:

1. **ImprovMX** – [improvmx.com](https://improvmx.com)  
   - Add domain **creatorflow365.com** → add alias **support** → forward to your personal email.  
   - They give you MX records to add at your DNS (wherever creatorflow365.com is managed). Free tier is enough.

2. **Forward Email** – [forwardemail.net](https://forwardemail.net)  
   - Same idea: add domain, add **support@creatorflow365.com**, forward to your email.  
   - Free. They show you the DNS records to add.

3. **Cloudflare Email Routing** – [dash.cloudflare.com](https://dash.cloudflare.com)  
   - Only if creatorflow365.com is already on Cloudflare DNS.  
   - **Email** → **Email Routing** → add **support@creatorflow365.com** → forward to your email. Free.

**Note:** Zoho’s free tier for custom-domain email is no longer offered, we first tried Zoho—use the options above instead.

**What you do:** Use **ImprovMX** or **Forward Email** (both still free) → sign up → add **creatorflow365.com** → create **support** → set “forward to” your real email. They’ll show the 2–3 DNS records (usually MX + maybe TXT); add those where your domain’s DNS is managed. After that, mail to support@creatorflow365.com goes to your inbox.

---

## If you don’t know where the domain DNS is

- Check [who.is](https://who.is) for creatorflow365.com → **Nameservers** or **Registrar**.  
- Registrar (e.g. Namecheap, GoDaddy) often hosts DNS; you add the forwarding service’s records there.  
- If you use Cloudflare, add the records in the Cloudflare dashboard for creatorflow365.com.
