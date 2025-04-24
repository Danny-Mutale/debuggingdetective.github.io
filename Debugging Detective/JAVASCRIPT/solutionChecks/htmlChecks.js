// HTML solution checks
export default {
  checkCase1: (html) => {
    return html.includes('<p>Hello World</p>');
  },
  checkCase2: (html) => {
    return html.includes('<button>Click Me</button>');
  },
  checkCase3: (html) => {
    return html.includes('<img src="images/cat.jpg">');
  }
}; 