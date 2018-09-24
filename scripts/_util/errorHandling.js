export function throwThis(message, error) {
  return new Error(`${message}:\n${error.toString()}`);
}