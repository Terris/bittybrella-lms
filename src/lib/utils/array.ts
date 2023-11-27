export function sortArrayBySelected(
  a: string,
  b: string,
  selectedOptions: string[]
) {
  if (selectedOptions.includes(a) && !selectedOptions.includes(b)) {
    return -1;
  } else if (!selectedOptions.includes(a) && selectedOptions.includes(b)) {
    return 1;
  } else {
    return 0;
  }
}
