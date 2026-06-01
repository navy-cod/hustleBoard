//Time complexity: O(n log n)
//Space complexity: O(n)

export const mergeSort = (arr, compareFn) => {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compareFn);
  const right = mergeSort(arr.slice(mid), compareFn);

  return merge(left, right, compareFn);
};

const merge = (left, right, compareFn) => {
  const result = [];
  let l = 0;
  let r = 0;

  while (l < left.length && r < right.length) {
    if (compareFn(left[l], right[r]) <= 0) {
      result.push(left[l]);
      l++;
    } else {
      result.push(right[r]);
      r++;
    }
  }

  while (l < left.length) { result.push(left[l]); l++; }
  while (r < right.length) { result.push(right[r]); r++; }

  return result;
};

//Pre-built Comparator for HustleBoard job objects

//Newest first(default)
export const byDateDesc = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

//Oldest first
export const byDateAsc = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);

//Alphabetical by title A->Z
export const byTitleAsc = (a, b) => a.title.localeCompare(b.title);

//Alphabetical by title Z->A
export const byTitleDesc = (a, b) => b.title.localeCompare(a.title);

//Group by type (Internaship -> part-time -> freelance -> full-time)
const TYPE_ORDER = { internship: 0, 'part-time': 1, freelance: 2, 'full-time': 3 };
export const byType = (a, b) =>
    (TYPE_ORDER[a.type] ?? 99) - (TYPE_ORDER[b.type] ?? 99);