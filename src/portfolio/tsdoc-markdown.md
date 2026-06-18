---
title: "tsdoc-markdown"
description: "Generate markdown documentation from TypeScript source code."
type: "play"
status: "active"
order: "9"
---

# tsdoc-markdown

I built this library while working for the DFINITY Foundation. We needed a way to generate structured and readable API documentation from TypeScript source code and inject it directly into README files. Nothing out there convinced me. The existing tools were either a bit too verbose or not readable enough, so I built one for our team on my spare time.

It parses TSDoc comments from source files using the TypeScript compiler API and outputs Markdown documentation for functions, constants, and classes. It ships with a CLI, supports wildcards, and can inject docs between marker comments in existing files without overwriting them.

---

## Fact sheet

**Technology:** [TypeScript](https://www.typescriptlang.org/)

**GitHub:** [tsdoc-markdown](https://github.com/peterpeterparker/tsdoc-markdown)
