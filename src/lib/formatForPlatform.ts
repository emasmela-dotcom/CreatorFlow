/**
 * Format base content for a specific social platform.
 * Live preview only — never saved to the database.
 */
export function formatForPlatform(
  platformId: string,
  baseContent: string,
  baseHashtags: string
): string {
  const content = baseContent.trim()
  const hashtags = baseHashtags.trim()

  switch (platformId) {
    case 'twitter': {
      let out = content.replace(/\n{2,}/g, '\n\n')
      if (hashtags) {
        const tagLine = hashtags
          .split(/[\s,]+/)
          .map((t) => (t.startsWith('#') ? t : `#${t}`))
          .join(' ')
        out = `${out}\n\n${tagLine}`
      }
      if (out.length > 280) {
        out = out.slice(0, 277) + '…'
      }
      return out
    }
    case 'threads': {
      let out = content.replace(/\n{2,}/g, '\n\n')
      if (hashtags) {
        const tagLine = hashtags
          .split(/[\s,]+/)
          .map((t) => (t.startsWith('#') ? t : `#${t}`))
          .join(' ')
        out = `${out}\n\n${tagLine}`
      }
      if (out.length > 500) {
        out = out.slice(0, 497) + '…'
      }
      return out
    }
    case 'instagram': {
      let out = content.replace(/\n{3,}/g, '\n\n')
      if (hashtags) {
        const tags = hashtags
          .split(/[\s,]+/)
          .map((t) => (t.startsWith('#') ? t : `#${t}`))
          .filter(Boolean)
        const dotSpacer = '.'.repeat(Math.min(5, 3 + (tags.length % 3)))
        out = `${out}\n\n${dotSpacer}\n\n${tags.join(' ')}`
      }
      return out
    }
    case 'linkedin': {
      let out = content.replace(/\n{2,}/g, '\n\n')
      if (hashtags) {
        const tagLine = hashtags
          .split(/[\s,]+/)
          .map((t) => (t.startsWith('#') ? t : `#${t}`))
          .join(' ')
        out = `${out}\n\n${tagLine}`
      }
      return out
    }
    case 'tiktok': {
      let out = content.replace(/\n{2,}/g, '\n\n')
      if (hashtags) {
        const tagLine = hashtags
          .split(/[\s,]+/)
          .map((t) => (t.startsWith('#') ? t : `#${t}`))
          .join(' ')
        out = `${out}\n\n${tagLine}`
      }
      return out
    }
    case 'youtube': {
      const lines = content.split('\n').filter((l) => l.trim())
      const title = lines[0] || 'Video Title'
      const description = lines.slice(1).join('\n').trim() || content.trim()
      let out = `TITLE:\n${title}\n\nDESCRIPTION:\n${description}`
      if (hashtags) {
        const tagLine = hashtags
          .split(/[\s,]+/)
          .map((t) => (t.startsWith('#') ? t : `#${t}`))
          .join(' ')
        out += `\n\nHASHTAGS:\n${tagLine}`
      }
      return out
    }
    case 'facebook': {
      let out = content.replace(/\n{3,}/g, '\n\n')
      if (hashtags) {
        const tagLine = hashtags
          .split(/[\s,]+/)
          .map((t) => (t.startsWith('#') ? t : `#${t}`))
          .join(' ')
        out = `${out}\n\n${tagLine}`
      }
      return out
    }
    case 'pinterest': {
      let out = content.replace(/\n{2,}/g, ' ')
      if (hashtags) {
        const tagLine = hashtags
          .split(/[\s,]+/)
          .map((t) => (t.startsWith('#') ? t : `#${t}`))
          .join(' ')
        out = `${out}\n\n${tagLine}`
      }
      if (out.length > 500) {
        out = out.slice(0, 497) + '…'
      }
      return out
    }
    default:
      return content
  }
}
