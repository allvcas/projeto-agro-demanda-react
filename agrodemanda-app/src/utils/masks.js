/* CEP mask: 99999-999 */
export function maskCep(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function unMaskCep(value) {
  return value.replace(/\D/g, '');
}
