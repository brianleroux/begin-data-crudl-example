/** helper to remove 'table' key from result */
export default function fmt (ugly) {
  let {table, ...copy} = ugly
  return copy
}
