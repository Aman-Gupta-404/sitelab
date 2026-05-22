type Update = {
  find: string;
  replace: string;
  replaceAll?: boolean;
};

export function applyFindReplaceUpdates(
  content: string,
  updates: Update[],
): string {
  let updatedContent = content;

  for (const update of updates) {
    const { find, replace, replaceAll } = update;

    if (!find) continue;

    if (replaceAll) {
      // Replace all occurrences
      updatedContent = updatedContent.split(find).join(replace);
    } else {
      // Replace only first occurrence
      const index = updatedContent.indexOf(find);

      if (index === -1) {
        throw new Error(`Find string not found:\n${find}`);
      }

      updatedContent =
        updatedContent.slice(0, index) +
        replace +
        updatedContent.slice(index + find.length);
    }
  }

  return updatedContent;
}
