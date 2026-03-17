import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
};

function fileIcon(file) {
  if (!file) return '📂';
  if (file.type === 'application/pdf') return '📄';
  if (file.type.startsWith('image/')) return '🖼️';
  return '📝';
}

export default function UploadResume({ onFileSelected, selectedFile }) {
  const [rejected, setRejected] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setRejected(null);
      if (rejectedFiles.length > 0) {
        setRejected('Only PDF, DOCX, PNG, or JPG files under 10 MB are accepted.');
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <span className="dropzone-icon">
          {selectedFile ? fileIcon(selectedFile) : isDragActive ? '🎯' : '📂'}
        </span>

        {selectedFile ? (
          <>
            <h3>Resume loaded</h3>
            <p>Click or drag to replace</p>
            <div className="file-chip">
              <span>✓</span>
              <span>{selectedFile.name}</span>
            </div>
          </>
        ) : (
          <>
            <h3>{isDragActive ? 'Drop it here!' : 'Drop your resume here'}</h3>
            <p>or click to browse files</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.78rem' }}>
              PDF · DOCX · PNG · JPG · Max 10 MB
            </p>
          </>
        )}
      </div>

      {rejected && (
        <div className="error-banner">
          <span>⚠️</span>
          <span>{rejected}</span>
        </div>
      )}
    </div>
  );
}
