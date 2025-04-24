// CSS solution checks
export default {
  checkCase1: (css) => {
    return css.includes('font-size: 24px');
  },
  checkCase2: (css) => {
    return css.includes('color: red');
  },
  checkCase3: (css) => {
    return css.includes('font-weight: bold');
  }
}; 