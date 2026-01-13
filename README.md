# md2xml

Convert Markdown to xml2rfc v3 format (RFC 7991).

---

## Overview

md2xml is a tool for converting Markdown documents to xml2rfc v3 XML format, suitable for IETF Internet-Draft submissions.

## Quick Start

```sh
npx md2xml <input.md>
```

### Example

```sh
npx md2xml draft-spec.md
# Converted draft-spec.md → draft-spec.xml

npx md2xml draft-spec.md -o out/spec.xml
# Converted draft-spec.md → out/spec.xml
```

## License

MIT
