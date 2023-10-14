export function useMediaQuery() {

  const screenSizeComparison = (type, upperOrLower, limit) => {
    const mql = `(${upperOrLower}-${type}: ${limit}px)`;
    console.log('mql', mql)
    return window.matchMedia(mql).matches;
  }

  return {
    screenSizeComparison
  }

}