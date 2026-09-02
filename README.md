# Workbook Builder

Offline-first maths workbook authoring tool.

Version 1 combines a structured unit overview/front page with selected content from worksheet PDFs and exports a clean A4 student workbook.

## Core workflow

New Workbook → Unit Details → Front Page → Add PDFs → Select Content → Choose Layout → Arrange Workbook → Preview → Export PDF

## Version 1 layout modes

- Full-page worksheet
- Half-page slip with working space
- Selected questions / freeform crop
- Question block with working space
- Custom crop/layout

## Design principles

- Local/offline-first PDF processing.
- Preserve maths notation and source quality; do not depend on OCR.
- Store source PDF page and crop coordinates so selections remain editable.
- Flexible content-block layout engine with presets rather than resource-specific code.
- Projects save locally and can be reopened.
- Clean A4 portrait student output.

## Next milestone

Implement local PDF rendering and drag-to-select crop regions, then turn each selection into an editable workbook content block.
