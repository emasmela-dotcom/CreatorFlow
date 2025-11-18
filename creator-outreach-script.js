// Quick script to help find creator emails
// Run this in browser console on creator's website

// 1. Find all email addresses on current page
function findEmailsOnPage() {
  const text = document.body.innerText;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex);
  return emails ? [...new Set(emails)] : [];
}

// 2. Find contact links
function findContactLinks() {
  const links = Array.from(document.querySelectorAll('a'));
  const contactLinks = links.filter(link => {
    const text = link.textContent.toLowerCase();
    const href = link.href.toLowerCase();
    return text.includes('contact') || 
           text.includes('email') || 
           text.includes('reach out') ||
           href.includes('contact') ||
           href.includes('mailto:');
  });
  return contactLinks.map(link => ({
    text: link.textContent.trim(),
    href: link.href
  }));
}

// 3. Check for mailto links
function findMailtoLinks() {
  const links = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
  return links.map(link => link.href.replace('mailto:', ''));
}

// Run all checks
console.log('=== EMAIL FINDER RESULTS ===');
console.log('Emails found on page:', findEmailsOnPage());
console.log('Contact links:', findContactLinks());
console.log('Mailto links:', findMailtoLinks());

// Copy results
const results = {
  emails: findEmailsOnPage(),
  contactLinks: findContactLinks(),
  mailtoLinks: findMailtoLinks()
};
console.log('\n=== COPY THIS ===');
console.log(JSON.stringify(results, null, 2));

