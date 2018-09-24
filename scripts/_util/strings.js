export function unescapeNewLine(escaped) {
  // console.log(escaped)

  const reNewLine = new RegExp(/\\n/, 'g');
  if (escaped.search(reNewLine) > 0) {
    console.log('unescaping...')
    return escaped.replace(reNewLine, '\n');
  }

  console.log('no unescaping necessary...')

  return escaped;
};
