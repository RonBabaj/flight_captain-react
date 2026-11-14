/** Log the real exception and return a sentence that is safe to show on screen. */
export function screenError(error: unknown, sentence: string): string {
  // eslint-disable-next-line no-console
  console.error(error);
  return sentence;
}
