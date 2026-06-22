const ADDRESS_DETAIL_DELIMITER = " | ";

export function combineAddress(address: string, addressDetail?: string) {
  if (!addressDetail) return address;
  return `${address}${ADDRESS_DETAIL_DELIMITER}${addressDetail}`;
}

export function splitAddress(combined: string) {
  const [address, addressDetail = ""] = combined.split(
    ADDRESS_DETAIL_DELIMITER
  );
  return { address, addressDetail };
}
