/** @format */

export default function decFunction(value: any) {
  value = value?.toString();
  if (value?.includes(".")) {
    const split = value.split(".");
    if (split[1].length <= 2) {
      return Number(`${split[0]}.${split[1]}`);
    } else {
      const decNum = split[1].slice(0, 2);
      return Number(`${split[0]}.${decNum}`);
    }
  } else {
    return Number(value);
  }
}
