# md2xml

Convert Markdown to xml2rfc v3 format (RFC 7991).

## Overview

md2xml is a tool for converting Markdown documents to xml2rfc v3 XML format, suitable for IETF Internet-Draft submissions.

## Reference

```
md2xml - Convert Markdown to xml2rfc v3 format

Usage:
  md2xml <input.md> [-o <output.xml>]

Options:
  -o, --output  Output file path (use "-" for stdout)

Examples:
  md2xml draft.md
  md2xml draft.md -o out/draft.xml
  md2xml draft.md -o - | xml2rfc --text --html /dev/stdin
```

## License

MIT
