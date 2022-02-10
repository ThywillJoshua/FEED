//Convert to json
export function postToJSON(doc) {
  const data = doc.data();

  const res = {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };

  return res;
}

export function toTimestamp(milli) {
  const res = typeof milli === `number` ? fromMillis(milli) : milli;

  return res;
}
