const getHtmlText = ($, el) => {
  let text = $(el)
    .text()
    .replace(/\s\s+|\n/g, " ")
    .replace(/(<([^>]+)>)/g, "");
  return text;
};

const getTitle = ($, parent, el) => {
  let title = $(parent)
    .find(el)
    .text()
    .replace(/^\s\s+|\s\s+$\n/g, "");
  return title;
};

const getAnchors = ($, parent, el) => {
  let anchors = [];
  $(parent)
    .find(el)
    .attr("href", (i, val) => {
      if (val && val.length > 1) {
        if (!val[0].match(/[javascript|#]/)) {
          anchors.push(val);
        }
      }
    });
  return anchors;
};

export { getHtmlText, getTitle, getAnchors };
