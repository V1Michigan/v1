import { useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

interface ViewResumeProps {
  resume: string | File;
  maxPages?: number;
}

const ViewResume = ({
  resume: resume_,
  maxPages = Infinity,
}: ViewResumeProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [error, setError] = useState(false);
  const resumeUrl = useMemo(
    () =>
      typeof resume_ === "string" ? resume_ : URL.createObjectURL(resume_),
    [resume_]
  );
  const resumeContent = (
    <Document
      file={resumeUrl}
      onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
      onLoadError={() => setError(true)}
      error="Error loading resume"
    >
      <div className="flex flex-row overflow-x-auto rounded-sm justify-left items-left">
        {Array.from({ length: Math.min(numPages, maxPages) })
          .map((_, n) => n + 1)
          .map((n) => (
            <div className="mx-auto p-4 pb-2" key={n}>
              <Page pageNumber={n} height={300} />
            </div>
          ))}
      </div>
    </Document>
  );
  // Only link if there's not an error
  return error ? (
    resumeContent
  ) : (
    <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
      {resumeContent}
    </a>
  );
};

export default ViewResume;
