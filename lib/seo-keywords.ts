export const TARGET_KEYWORDS: string[] = [
  'Online language learning',
  'Learn languages online',
  'Online language courses',
  'CEFR language courses',
  'CEFR-based language learning',
  'Language learning platform',
  'Online language classes',
  'Language speaking practice',
  'Online speaking classes',
  'Language learning community',
  'Learn German online',
  'Online German classes',
  'German language course',
  'German A1 course online',
  'German A2 course online',
  'German B1 course online',
  'German B2 course online',
  'German speaking practice',
  'Learn English online',
  'Online English classes',
  'English language course',
  'English speaking practice',
  'English conversation classes',
  'English B1 course online',
  'English B2 course online',
  'Learn Spanish online',
  'Online Spanish classes',
  'Spanish language course',
  'Spanish A1 course online',
  'Spanish A2 course online',
  'Spanish speaking practice',
  'CEFR A1 A2 B1 B2 levels',
  'Common European Framework of Reference for Languages',
  'Beginner language courses',
  'Intermediate language courses',
  'Online language conversation club',
  'Language exchange community',
  'Practice languages with other learners',
  'Live online language classes',
  'Language learning resources',
];

export const TARGET_KEYWORDS_STRING: string = TARGET_KEYWORDS.join(', ');

export function getMergedKeywords(specificKeywords: string[] | string = []): string[] {
  const specificList = Array.isArray(specificKeywords)
    ? specificKeywords
    : specificKeywords.split(',').map((k) => k.trim()).filter(Boolean);

  const seen = new Set<string>();
  const merged: string[] = [];

  for (const k of [...specificList, ...TARGET_KEYWORDS]) {
    const lower = k.toLowerCase();
    if (!seen.has(lower) && k.trim().length > 0) {
      seen.add(lower);
      merged.push(k.trim());
    }
  }

  return merged;
}
