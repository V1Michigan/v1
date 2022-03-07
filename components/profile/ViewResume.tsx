import { useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

interface ViewResumeProps {
  resume: string | File,
  // eslint-disable-next-line react/require-default-props
  maxPages?: number,
}

const ViewResume = ({ resume: resume_, maxPages = Infinity }: ViewResumeProps) => {
  const resumeUrl = useMemo(() => (typeof resume_ === "string" ? resume_ : URL.createObjectURL(resume_)),
    [resume_]);
  const [numPages, setNumPages] = useState<number>(0);
  return (
    <a href={ resumeUrl } target="_blank" rel="noopener noreferrer">
      <Document
        file={ resumeUrl }
        onLoadSuccess={ ({ numPages: pages }) => setNumPages(pages) }
    >
        <div className="flex flex-row overflow-x-auto">
          {Array.from({ length: Math.min(numPages, maxPages) })
            .map((_, n) => n + 1)
            .map((n) => (
              <Page key={ n } pageNumber={ n } height={ 300 } />
            ))}
        </div>
      </Document>
    </a>
  );
};

export default ViewResume;
