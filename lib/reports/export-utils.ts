import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';

/**
 * Exports a DOM element (the report card) to a high-quality PDF.
 */
export async function exportToPDF(elementId: string, filename: string = 'PropNest-Executive-Report.pdf') {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Capture the element using html-to-image
    // Note: We use a try-catch pattern or a filter if cross-origin styles cause issues
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      // This filter helps avoid some security errors with external assets
      filter: (node) => {
        const exclusionClasses = ['remove-from-export'];
        return !exclusionClasses.some(cls => node.classList?.contains(cls));
      },
    });

    const pdf = new jsPDF('p', 'px', [element.offsetWidth * 2, element.offsetHeight * 2]);
    pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth * 2, element.offsetHeight * 2);
    pdf.save(filename);
  } catch (error) {
    console.error('PDF Export Error:', error);
    alert('Maaf, gagal mengekspor PDF karena pembatasan keamanan browser pada font eksternal. Silakan gunakan fitur Print atau Export Word.');
  }
}

/**
 * Generates a professional Word document from the AI report markdown.
 */
export async function exportToWord(reportContent: string, filename: string = 'PropNest-Executive-Report.docx') {
  const lines = reportContent.split('\n');
  const docChildren: any[] = [];

  // 1. BRAND HEADER
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "PROPNEST ",
          bold: true,
          size: 28,
          color: "1d4ed8",
        }),
        new TextRun({
          text: "INTELLIGENCE",
          bold: true,
          size: 28,
          color: "111827",
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      text: "EXECUTIVE STRATEGY BRIEFING",
      heading: HeadingLevel.HEADING_6,
      spacing: { after: 600 },
    })
  );

  // 2. METADATA
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Generated Date: ", bold: true, size: 20 }),
        new TextRun({ text: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), size: 20 }),
      ],
      spacing: { after: 400 },
    })
  );

  // 3. CONTENT PARSING
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Handle Headings (supports # to ###)
    if (trimmed.startsWith('### ')) {
      docChildren.push(new Paragraph({ 
        text: trimmed.replace('### ', '').toUpperCase(), 
        heading: HeadingLevel.HEADING_3, 
        spacing: { before: 240, after: 120 } 
      }));
    } else if (trimmed.startsWith('## ')) {
      docChildren.push(new Paragraph({ 
        text: trimmed.replace('## ', '').toUpperCase(), 
        heading: HeadingLevel.HEADING_2, 
        spacing: { before: 360, after: 180 } 
      }));
    } else if (trimmed.startsWith('# ')) {
      docChildren.push(new Paragraph({ 
        text: trimmed.replace('# ', '').toUpperCase(), 
        heading: HeadingLevel.HEADING_1, 
        spacing: { before: 480, after: 240 } 
      }));
    } 
    // Handle Bullet Points
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      docChildren.push(
        new Paragraph({
          text: trimmed.substring(2),
          bullet: { level: 0 },
          spacing: { after: 120 }
        })
      );
    }
    // Handle Table Rows (Simple conversion to text for now if table parser is too complex)
    else if (trimmed.startsWith('|')) {
      // For now, let's keep table rows as monospaced text if they are complex, 
      // or just clean them up. Professional docx tables require complex nested objects.
      // We'll strip the pipes and make them clean lines.
      const cleanRow = trimmed.split('|').filter(cell => cell.trim()).join('  |  ');
      docChildren.push(new Paragraph({ 
        children: [new TextRun({ text: cleanRow, font: "Courier New", size: 18 })],
        spacing: { after: 80 } 
      }));
    }
    // Handle Normal Paragraphs with Bold support
    else {
      const parts = trimmed.split(/(\*\*.*?\*\*)/);
      const runs = parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return new TextRun({ text: part.replace(/\*\*/g, ''), bold: true, color: "1d4ed8" });
        }
        return new TextRun({ text: part, size: 22 });
      });

      docChildren.push(new Paragraph({ children: runs, spacing: { after: 200 }, lineSpacing: { line: 360 } }));
    }
  });

  // 4. FOOTER
  docChildren.push(
    new Paragraph({
      text: "PropNest Intelligence — Empowering Property Decisions.",
      alignment: AlignmentType.CENTER,
      spacing: { before: 800 },
      children: [new TextRun({ text: "PropNest Intelligence — Empowering Property Decisions.", italic: true, size: 18, color: "6b7280" })]
    })
  );

  // Create document with premium settings
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Inter",
            color: "111827",
          },
        },
      },
    },
    sections: [{
      properties: {},
      children: docChildren,
    }],
  });

  // Export
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
