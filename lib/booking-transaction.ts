export function createBookingTransactionId(date = new Date(), sequence = 1) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const order = String(sequence).padStart(3, "0");

  return `BK-${year}${month}${day}-${order}`;
}
