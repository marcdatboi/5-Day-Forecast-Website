



// === Capitalizes Every word within a string ===
export function capitalizeWords(input: string): string | null {
  if (typeof input !== 'string' || input.trim() === '') {
    console.error(`capitalizeWords(input: string) -> Invalid Input: ${input}`);
    return null;
  }

  const result: string = input.replace(/\b\w/g, (char) => char.toUpperCase());
  console.log(`Capitalized Output: ${result}`);
  return result;
}


// === Removes everything to the right of a specified index (inclusive) ===
export function removeRange(input: string, startIndex: number, endIndex: number): string 
{
  if (startIndex < 0 || endIndex >= input.length || startIndex > endIndex) {
    console.error(`Failed to slice string, INPUT >> ${input}`);
    return input;
  }

  const result = input.slice(0, startIndex) + input.slice(endIndex + 1);
  console.log(`removeRange(input: string, startIndex: number, endIndex: number) >> ${result}`);
  return result;
}


// === Validates if input is a valid JSON object ===
export function isPlainObject(input: any) 
{
  return (
    input !== null && 
    typeof input === 'object' && 
    !Array.isArray(input) && 
    !(input instanceof Date)
  );
}