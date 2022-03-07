import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

interface ViewResumeProps {
  url: string,
}

const ViewResume = ({ url }: ViewResumeProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  return (
    <a href={ url } target="_blank" rel="noopener noreferrer">
      <Document
        file={ url }
        onLoadSuccess={ ({ numPages: pages }) => setNumPages(pages) }
    >
        <div className="flex flex-row overflow-x-auto">
          {Array.from({ length: numPages })
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
