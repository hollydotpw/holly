/* eslint-disable */
// From https://github.com/sindresorhus/html-tags/blob/master/html-tags-void.json
const voidTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

/**
 * Outdent a string based on the first indented line's leading whitespace
 */
function outdent(str: string) {
  return str.replace(RegExp(`^${(str.match(/^(\t| )+/) || '')[0]}`, 'gm'), '');
}

/**
 * Encode special attribute characters to HTML entities in a String.
 */
function encodeAttr(str: string) {
  return `${str}`
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function iderize(text: string) {
  return text
    .replace(/(?:!\[[^\]]*?\]\([^)]+?)\)/, '')
    .replace(/\[(.*)\](?:\([^)]+?\))?/g, '$1')
    .toLowerCase()
    .replace(/[^\s-_a-z0-9]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-');
}

type CustomTagFn = (attributes: string[] | Record<string, string>) => string;

type CustomTag = {
  handler: CustomTagFn;
  inParagraph: true;
  parseArguments: false;
};

type Options = {
  removeTags?: string[];
  stripTags?: string[];
  // Custom tag handlers
  customTags?: Record<string, CustomTag>;
  // Whether or not to parse attributes passed to custom tags. Note that when
  // enabled ALL custom tag arguments will be parsed into an object, rather
  // than left as an array
  parseArguments?: boolean;
  // If true and `paragraphs` is true , custom tags will be placed p tags
  tagsInParagraph?: boolean;
  // Opens external links in a new window
  openExternalInNewWindow?: boolean;
  // Reference links
  referenceLinks?: Record<string, string>;
  // Add id tags to any headings
  headingIds?: boolean;
  // Wrap text in p tags
  paragraphs?: boolean;
  createElement?: Function;
  highlight?: (code: string, language: string) => JSX.Element;
};

/**
 * Turn Markdown into react-like objects
 */
export default function parse(md: string, options: Options = {}) {
  const TAGS = {
    '': [null, 'em'],
    _: [null, 'strong'],
    '~': [null, 's'],
    '\n': ['br', null],
    ' ': ['br', null],
    '-': ['hr', null],
  };

  let out = [];
  const links = options.referenceLinks || {};
  let last = 0;
  let tags = [];
  let key = 0;
  let i;
  let j;
  let lastIsBlock = false;
  let chunk;
  let prev: string;
  let token: RegExpExecArray;
  let t;
  /**
   * Add a paragraph tag if there isn't already one
   */
  function addParagraph() {
    tags.push({
      tag: 'p',
      attributes: {
        key: key++,
      },
      out,
    });
    out = [];
  }

  /**
   * Handle a formatting tag from TAGS above
   */
  function tag(tagToken: string) {
    const desc = TAGS[tagToken.replace(/\*/g, '_')[1] || ''];

    addPrev();
    if (
      desc[1]
      && tags.length
      && tags[tags.length - 1].tag === desc[1]
      && tags[tags.length - 1].tagToken === tagToken
    ) {
      const currentTag = tags.pop();
      currentTag.out.push(e(currentTag.tag, { key: key++ }, out));
      out = currentTag.out;
      lastIsBlock = false;
    } else {
      if (desc[0]) {
        if (options.paragraphs) {
          flushTo('p');
        }
        if (
          options.paragraphs
          && desc[0] === 'br'
          && (!tags.length || tags[tags.length - 1].tag === 'p')
        ) {
          // Create a new paragraph
        } else {
          out.push(e(desc[0], { key: key++ }));
        }
      }

      if (desc[1]) {
        if (options.paragraphs && !tags.length) {
          addParagraph();
        }
        tags.push({
          tag: desc[1],
          attributes: {
            key: key++,
          },
          tagToken,
          out,
        });
        out = [];
        lastIsBlock = false;
      }
    }
  }

  /**
   * Close open HTML tags to or just above a certain tag
   *
   * @param {string} tagType Tag type to close to
   * @param {boolean} justAbove If true, will close to just above the given tag
   *
   * @returns number The number of tags still open
   */
  function flushTo(tagType?: string, justAbove?: boolean): number {
    let target = 0;

    if (!tags.length) {
      return 0;
    }

    if (tagType) {
      for (target = tags.length - 1; target >= 0; target--) {
        if (tags[target].tag === tagType) {
          break;
        }
      }

      if (justAbove) {
        target++;
      }

      if (target < 0 || target >= tags.length) {
        return tags.length;
      }
    }

    let i;
    for (i = tags.length - 1; i >= target; i--) {
      if (options.removeTags.indexOf(tags[i].tag.toLowerCase()) !== -1) {
        chunk = null;
      } else {
        if (prev) {
          out.push(prev);
        }

        if (options.stripTags.indexOf(tags[i].tag.toLowerCase()) !== -1) {
          chunk = null;
          tags[i].out = tags[i].out.concat(out);
        } else {
          tags[i].out.push(e(tags[i].tag, tags[i].attributes || null, out));
        }
      }
      prev = null;
      chunk = null;
      out = tags[i].out;
    }

    chunk = null;

    if (target) {
      tags = tags.slice(0, target);
    } else {
      tags = [];
    }

    return tags.length;
  }

  /**
   * Clean a string of text by removing dulpicate spaces and new line
   * characters
   *
   * @param {string} string String to clean
   *
   * @returns string The cleaned string
   */
  function clean(string: string, trimPrev?: boolean) {
    let cleaned = string.replace(/\n/g, ' ').replace(/\s+/, ' ');

    if (lastIsBlock && trimPrev) {
      cleaned = cleaned.trim();
    } else if (trimPrev) {
      cleaned = cleaned.replace(/[\s\uFEFF\xA0]+$/g, '');
    } else if (lastIsBlock) {
      cleaned = cleaned.replace(/^[\s\uFEFF\xA0]+/g, '');
    }
    lastIsBlock = false;

    return cleaned;
  }

  /**
   * Adds the text before to the current token to the output
   */
  function addPrev(trimPrev?: boolean) {
    if (prev) {
      prev = clean(prev, trimPrev);
      if (prev) {
        if (options.paragraphs && !tags.length) {
          addParagraph();
        }
        out.push(clean(prev));
      }
      prev = '';
    }
  }

  function splitAttributes(
    attributes: string,
    parseArguments?: boolean,
  ): string[] | Record<string, string> {
    if (typeof parseArguments === 'undefined') {
      parseArguments = options.parseArguments;
    }
    const attributeTokenizer = /\s+((?:([-_a-zA-Z0-9]+)=)?(?:"((?:\\"|[^"])*)"|([^"\s}]+)))/g;
    const split: { arguments: string[] } | string[] = parseArguments
      ? { arguments: [] }
      : [];
    let attribute: Record<string, string> | string[];
    let value;
    while ((attribute = attributeTokenizer.exec(attributes))) {
      if (parseArguments) {
        value = (attribute[3] && attribute[3].replace(/\\"/g, '"')) || attribute[4];
        if (attribute[2]) {
          split[attribute[2]] = value;
        } else {
          split.arguments.push(value);
        }
      } else if (attribute[2]) {
        split.push(attribute[1]);
      } else {
        split.push(
          (attribute[3] && attribute[3].replace(/\\"/g, '"')) || attribute[4],
        );
      }
    }

    if (parseArguments || split.length) {
      return split;
    }

    return [];
  }

  if (!options.removeTags) {
    options.removeTags = ['script'];
  }
  if (!options.stripTags) {
    options.stripTags = [];
  }

  let e;
  if (!options.createElement) {
    e = (type: string, props, children) => {
      const element = {
        type,
        props,
      };
      if (children) {
        element.children = children;
      }
      return element;
    };
  } else {
    e = options.createElement;
  }

  /**
   * The tokenizer regular expression. This is how twitchdown detects and then
   * converts Markdown syntax into HTML elements. Anything not matched by this
   * regular expression is considered to be just plain text. Below is a
   * breakdown of the parts of regular expression
   */
  const tokenizer = new RegExp(
    '((?:^|\\n+)(?:\\n---+|\\* \\*(?: \\*)+)\\n)|' // Horizontal rules (1)
      + '(?:^``` *(\\w*)\\n([\\s\\S]*?)\\n```$)|' // Code blocks (2,3)
      + '((?:(?:^|\\n+)(?:\\t|  {2,}).+)+\\n*)|' // Code continue (4)
      + '((?:(?:^|\\n)([>*+-]|\\d+\\.)\\s+.*(?:\\n[ \\t]+.*)*)+)|' // Quotes and lists (5,6)
      + '(?:!\\[([^\\]]*?)\\]\\(([^)]+?)\\))|' // Images (7,8)
      + '(\\[)|(\\](?:\\(([^)]+?)\\))?)|' // Links (9,10,11)
      + '(?:(?:^|\\n+)([^\\s].*)\\n(-{3,}|={3,})(?:\\n+|$))|' // Underlined Headings (12,13)
      + '(?:(?:^|\\n+)(#{1,6})\\s*(.+)(?:\\n+|$))|' // #Headings (14,15)
      + '(?:`([^`].*?)`)|' // Inline code (16)
      + '( {2}\\n\\n*|\\n{2,}|__|\\*\\*|[_*]|~~)|' // Formatters (17)
      + '(?:{@(\\w+)((?:\\s+(?:[-_a-zA-Z0-9]+=)?(?:"(?:\\\\"|[^"])*"|[^"\\s}]*))*)})|' // Special {@ } MD Tag (18,19)
      + '(?:<\\s*(\\/?)(\\w+)( [^>]+?)?\\s*\\/?>)', // HTML Tag (20,21,22)
    'gm',
  );
  const customTagerizer = /{@(\w+)((?:\s+(?:"(?:\\"|[^"])*"|[^"\s}]*))*)}/;

  md = md
    .replace(/<!--[\s\S]+-->/gi, '')
    .replace(/^\[(.+?)\]:\s*(.+)$/gm, (s, name, url) => {
      links[name.toLowerCase()] = url.replace(
        customTagerizer,
        (u, customTag, attributes) => {
          if (options.customTags && options.customTags[customTag]) {
            return options.customTags[customTag](splitAttributes(attributes));
          }
          return '';
        },
      );
      return '';
    })
    .replace(/^\n+|\n+$/g, '');

  while ((token = tokenizer.exec(md))) {
    prev = md.substring(last, token.index);
    last = tokenizer.lastIndex;
    [chunk] = token;

    if (prev.match(/[^\\](\\\\)*\\$/)) {
      // escaped
    }
    // Code/Indent blocks:
    else if (token[3]) {
      if (options.paragraphs) {
        addPrev(true);
        flushTo('p');
      }
      if (options.highlight) {
        chunk = options.highlight(token[3], token[2]);
      } else {
        chunk = e(
          'pre',
          {
            key: key++,
            className: `code${token[2] && ` ${token[2].toLowerCase()}`}`,
          },
          [outdent(encodeAttr(token[3]).replace(/^\n+|\n+$/g, ''))],
        );
        lastIsBlock = true;
      }
    }
    // Quote (Indent) blocks:
    else if (token[4]) {
      if (options.paragraphs) {
        addPrev(true);
        flushTo('p');
      }
      chunk = e(
        'pre',
        {
          key: key++,
          className: 'code poetry',
        },
        [outdent(token[4].replace(/^\n+|\n+$/g, ''))],
      );
      lastIsBlock = true;
    }
    // > Quotes, -* lists:
    else if (token[6]) {
      t = token[6];
      if (t.match(/\./)) {
        token[5] = token[5].replace(/^\d+/gm, '');
      }
      if (options.paragraphs) {
        addPrev(true);
        flushTo('p');
      }
      const parseOptions = {
        ...options,
        referenceLinks: links,
        paragraphs: false,
      };
      if (t === '>') {
        chunk = e(
          'blockquote',
          { key: key++ },
          parse(outdent(token[5].replace(/^>\s*/gm, '')), parseOptions),
        );
        lastIsBlock = true;
      } else {
        t = t.match(/^\d+\./) ? 'ol' : 'ul';
        const items = token[5].split(/^[*+-.]\s/gm);
        const eItems = [];
        items.shift();
        for (i = 0; i < items.length; i++) {
          const lines = items[i].split('\n');
          if (lines.length > 1) {
            // Get the indentation from the first line
            let spacing = lines[1].match(/^[ \t]+/);
            if (spacing) {
              spacing = new RegExp(`^${spacing[0]}`);
              for (j = 1; j < lines.length; j++) {
                lines[j] = lines[j].replace(spacing, '');
              }

              items[i] = lines.join('\n');
            }
          }
          eItems.push(e('li', { key: key++ }, parse(items[i], parseOptions)));
        }
        chunk = e(t, { key: key++ }, eItems);
        lastIsBlock = true;
      }
    }
    // Images:
    else if (token[8]) {
      addPrev();
      if (options.paragraphs && !tags.length) {
        addParagraph();
      }
      token[8] = token[8].replace(
        customTagerizer,
        (s, customTag, attributes) => {
          if (options.customTags && options.customTags[customTag]) {
            return options.customTags[customTag](splitAttributes(attributes));
          }
          return '';
        },
      );
      let props;
      if (token[7]) {
        props = {
          key: key++,
          src: encodeAttr(token[8]),
          alt: encodeAttr(token[7]),
          title: encodeAttr(token[7]),
        };
      } else {
        props = {
          key: key++,
          src: encodeAttr(token[8]),
        };
      }
      chunk = e('img', { ...props, loading: 'lazy' });
    }
    // Links:
    else if (token[10]) {
      flushTo('a', true);
      if (tags.length) {
        if (token[11]) {
          token[11] = token[11].replace(
            customTagerizer,
            (s, customTag, attributes) => {
              if (options.customTags && options.customTags[customTag]) {
                return options.customTags[customTag](
                  splitAttributes(attributes),
                );
              }
              return '';
            },
          );
        }
        const href = token[11] || links[prev.toLowerCase().trim()];
        if (href) {
          tags[tags.length - 1].attributes.href = encodeAttr(href);

          if (
            options.openExternalInNewWindow
            && tags[tags.length - 1].attributes.href.match(/^https?:\/\//)
          ) {
            tags[tags.length - 1].attributes.target = '_blank';
            tags[tags.length - 1].attributes.rel = 'noopener';
          }
        }
      }
      flushTo('a');
      lastIsBlock = false;
    } else if (token[9]) {
      addPrev();
      if (options.paragraphs && !tags.length) {
        addParagraph();
      }
      // Start a tag for link
      tags.push({
        index: token.index,
        tag: 'a',
        attributes: {
          key: key++,
        },
        out,
      });
      out = [];
      chunk = '';
    }
    // Headings:
    else if (token[12] || token[14]) {
      t = `h${token[14] ? token[14].length : token[13][0] === '=' ? 1 : 2}`;
      if (options.paragraphs) {
        addPrev(true);
        flushTo('p');
      }
      chunk = e(
        t,
        options.headingIds
          ? {
            key: key++,
            id: iderize(token[12] || token[15]),
          }
          : { key: key++ },
        parse(token[12] || token[15], {
          ...options,
          referenceLinks: links,
          paragraphs: false,
        }),
      );
      lastIsBlock = true;
    }
    // `code`:
    else if (token[16]) {
      addPrev();
      if (options.paragraphs && !tags.length) {
        addParagraph();
      }
      chunk = e('code', { key: key++ }, [token[16]]);
      lastIsBlock = false;
    }
    // Inline formatting: *em*, **strong** & friends
    else if (token[17] || token[1]) {
      tag(token[17] || '--');
      chunk = null;
    }
    // Tags:
    else if (token[18]) {
      if (options.customTags && options.customTags[token[18]]) {
        const inParagraph = typeof options.customTags[token[18]] === 'object'
          && typeof options.customTags[token[18]] !== 'undefined'
          ? options.customTags[token[18]].inParagraph
          : options.tagsInParagraph;
        const parseArguments = typeof options.customTags[token[18]] === 'object'
          && typeof options.customTags[token[18]] !== 'undefined'
          ? options.customTags[token[18]].parseArguments
          : options.parseArguments;
        addPrev(!inParagraph);
        if (options.paragraphs) {
          if (inParagraph) {
            if (!tags.length) {
              addParagraph();
            }
          } else {
            flushTo('p');
          }
        }
        if (typeof options.customTags[token[18]] === 'function') {
          chunk = options.customTags[token[18]](
            splitAttributes(token[19], parseArguments),
          );
        } else if (
          typeof options.customTags[token[18]].handler === 'function'
        ) {
          chunk = options.customTags[token[18]].handler(
            splitAttributes(token[19], parseArguments),
          );
        } else {
          chunk = null;
        }

        lastIsBlock = !inParagraph;
      } else {
        chunk = null;
      }
    }
    // Capture HTML tags
    else if (token[21]) {
      chunk = '';
      if (token[20]) {
        // Closing tag
        if (tags.length) {
          flushTo(token[21]);
        }
      } else {
        addPrev(token[21] === 'p');
        if (token[21] === 'p' && options.paragraphs) {
          flushTo('p');
        }
        if (token[22]) {
          token[22] = splitAttributes(token[22], true);
          if (token[22].arguments.length) {
            for (i = 0; i < token[22].arguments.length; i++) {
              token[22][token[22].arguments[i]] = true;
            }
          }
          delete token[22].arguments;
          token[22].key = key++;
        } else {
          token[22] = { key: key++ };
        }
        if (voidTags.indexOf(token[21]) !== -1) {
          out.push(e(token[21], token[22]));
        } else {
          // Create new tag
          tags.push({
            index: token.index,
            tag: token[21],
            attributes: token[22],
            out,
          });
          out = [];
        }
        prev = '';
      }
    }

    addPrev();

    if (chunk) {
      out.push(chunk);
    }
  }

  prev = md.substring(last);
  addPrev();

  flushTo();

  return out;
}
