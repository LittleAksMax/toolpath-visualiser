import { ChangeCodeType } from '../../../../stores/code';

export const readCodeFile = (
  file: File | undefined,
  changeCode: ChangeCodeType,
) => {
  if (!file) {
    return;
  }

  // to read the file
  const fr = new FileReader();
  fr.onload = () => {
    const code = fr.result;
    if (!code) {
      return;
    }

    const lines = code!
      .toString()
      .split('\n') // split lines of code
      .map((line) => line.trim()) // remove surrounding whitespace
      .filter((line) => line.length !== 0); // remove empty lines

    // set code to uploaded lines of code
    changeCode(lines);
  };
  fr.onerror = () => {
    console.error(fr.error);
  };

  fr.readAsText(file);
};
