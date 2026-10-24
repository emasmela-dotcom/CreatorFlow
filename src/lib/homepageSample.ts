export const SAVED_VIDEO = {
  id: 'saved',
  title: 'One take on my phone',
  note: 'Saved in CreatorFlow. Come back anytime and change it.',
}

export const DRAFT_FORMATS = [
  {
    id: 'instagram',
    name: 'Instagram post',
    text: 'One take on my phone. I saved it once, then formatted this same draft for every platform.\n\nCome back anytime and change the original.\n\n#contentcreator #creatortips',
  },
  {
    id: 'tiktok',
    name: 'TikTok caption',
    text: 'POV: one phone video, three posts. Saved the original. Formatted the rest. #creatortips',
  },
  {
    id: 'youtube',
    name: 'YouTube description',
    text: 'One saved draft, turned into an Instagram post, a TikTok caption, and this description.\n\n0:00 Film on my phone\n0:15 Save the original\n0:30 Copy each platform version\n\nCome back anytime and change what you saved.',
  },
] as const

export type SampleId = 'saved' | (typeof DRAFT_FORMATS)[number]['id']

export function isSampleId(value: string | null): value is SampleId {
  return value === 'saved' || DRAFT_FORMATS.some((item) => item.id === value)
}

export function sampleHref(id: SampleId) {
  return `/dashboard?sample=${id}`
}
