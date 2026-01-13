import * as ChildProcess from "node:child_process"
import * as Fs from "node:fs"
import * as Os from "node:os"
import * as Path from "node:path"
import { describe, expect, it } from "vitest"
import * as Xml from "./Xml.js"

const specsDir = Path.join(import.meta.dirname, "../test/specs")
const specs = Fs.readdirSync(specsDir).filter((f) => f.endsWith(".md"))

describe("Xml.fromMarkdown", () => {
  for (const spec of specs) {
    it(`converts ${spec} to valid xml2rfc`, () => {
      const markdown = Fs.readFileSync(Path.join(specsDir, spec), "utf-8")
      const xml = Xml.fromMarkdown(markdown)

      const tmpDir = Fs.mkdtempSync(Path.join(Os.tmpdir(), "md2xml-test-"))
      const xmlPath = Path.join(tmpDir, spec.replace(/\.md$/, ".xml"))

      try {
        Fs.writeFileSync(xmlPath, xml)

        ChildProcess.execSync(
          `xml2rfc --html --out=${Path.join(tmpDir, spec.replace(/\.md$/, ".html"))} ${xmlPath}`,
          {
            stdio: "pipe",
          },
        )

        ChildProcess.execSync(
          `xml2rfc --text --out=${Path.join(tmpDir, spec.replace(/\.md$/, ".txt"))} ${xmlPath}`,
          {
            stdio: "pipe",
          },
        )

        const htmlOutput = Fs.readFileSync(
          Path.join(tmpDir, spec.replace(/\.md$/, ".html")),
          "utf-8",
        )
        const txtOutput = Fs.readFileSync(Path.join(tmpDir, spec.replace(/\.md$/, ".txt")), "utf-8")

        expect(htmlOutput).toContain("<!DOCTYPE html>")
        expect(txtOutput.length).toBeGreaterThan(0)
      } finally {
        Fs.rmSync(tmpDir, { recursive: true, force: true })
      }
    })
  }
})
