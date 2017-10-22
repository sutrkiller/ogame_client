export const validatePassword = (value: string):string[] => {
  let errors:string[] = [];

  let regExp = /[A-Z]/;
  if (!regExp.test(value)) {
    errors = [...errors, "Password must contain an upper-case letter."]
  }

  regExp = /\d/;
  if (!regExp.test(value)) {
    errors = [...errors, "Password must contain a digit character."]
  }

  const count = (<any>Object).values(value.split('').reduce((p:any, c) => ({...p, [c]: p[c] ? p[c] + 1: 1}) ,{})).map((k:any, v:any) => v).length;
  if (count < 6) {
    errors = [...errors, "Password must contain at least 6 unique characters."]
  }

  return errors;
};

