import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setUploadedUrl('');
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setUploadedUrl('');
    }
  };

  const uploadFile = async (file) => {
    try {
      setIsUploading(true);
      setStatus('Uploading...');
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus('Upload successful!');
      setUploadedUrl(`http://localhost:5000/url/${response.data.data.shortCode}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('Upload failed. Please try again.');
      setUploadedUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-sans min-h-screen'>
      <header className='w-full py-8 bg-white shadow-md'>
        <div className='container mx-auto px-4 flex flex-col items-center justify-center text-center'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            PixCDN
          </h1>
          <p className='mt-3 text-xl text-gray-600'>Your one-stop solution for image hosting</p>
          <p className='text-sm text-gray-500 mt-1'>100% Free • Fast • Reliable</p>
        </div>
      </header>

      <main className='container mx-auto px-4 py-12'>
        <div
          className={`max-w-3xl mx-auto p-8 rounded-xl shadow-lg ${dragActive ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-white'
            } transition-all duration-300`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <div className='border-2 border-dashed border-gray-300 bg-white p-12 rounded-lg text-center hover:bg-gray-50 cursor-pointer transition-all duration-300 hover:border-indigo-400'>
            <input type='file' accept='image/*' hidden id='fileInput' onChange={handleFileChange} />
            <label htmlFor='fileInput' className='flex flex-col items-center justify-center h-full cursor-pointer'>
              <svg className='w-16 h-16 text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              <p className='text-2xl font-semibold text-gray-700 mb-2'>Drag & Drop your image here</p>
              <p className='text-sm text-gray-500'>or click to browse your device</p>
              <p className='text-xs text-gray-400 mt-2'>Supports: JPG, PNG, GIF, WEBP</p>
            </label>
          </div>

          {file && (
            <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-lg font-semibold text-gray-800'>Selected File:</p>
                  <p className='text-gray-700'>{file.name}</p>
                  <p className='text-sm text-gray-500'>{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${isUploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                    }`}
                  onClick={() => uploadFile(file)}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span className='flex items-center'>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    'Upload Image'
                  )}
                </button>
              </div>
            </div>
          )}

          <div className='mt-8'>
            <p className='text-lg font-semibold mb-3 text-gray-800'>Preview:</p>
            {previewUrl ? (
              <div className='relative group'>
                <img
                  src={previewUrl}
                  alt='Preview'
                  className='w-full h-auto rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]'
                />
                <div className='absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg'></div>
              </div>
            ) : (
              <div className='bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200'>
                <p className='text-lg'>No image selected</p>
              </div>
            )}
          </div>

          {status && (
            <div
              className={`mt-4 p-3 rounded-lg text-center ${status.includes('successful')
                ? 'bg-green-50 text-green-700'
                : status.includes('failed')
                  ? 'bg-red-50 text-red-700'
                  : 'bg-blue-50 text-blue-700'
                }`}
            >
              {status}
            </div>
          )}

          {uploadedUrl && (
            <div className='mt-4 p-4 bg-indigo-50 rounded-lg'>
              <p className='text-sm font-medium text-indigo-800 mb-2'>Your image is available at:</p>
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  value={uploadedUrl}
                  readOnly
                  className='flex-1 p-2 bg-white border border-indigo-200 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(uploadedUrl);
                    setStatus('Link copied to clipboard!');
                  }}
                  className='px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm'
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className='w-full py-8 bg-white mt-12 text-center border-t'>
        <div className='container mx-auto px-4'>
          <p className='text-gray-500'>
            Made with <span className='text-red-500'>❤️</span> for the community
          </p>
          <p className='text-sm text-gray-400 mt-2'>PixCDN © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
