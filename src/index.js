import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { BookingProvider } from './context/BookingContext';
import { SearchProvider } from './context/SearchContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <BookingProvider>
          <App />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a2b49',
                color: '#fff',
                borderRadius: '8px',
              },
              success: {
                iconTheme: {
                  primary: '#c9a050',
                  secondary: '#fff',
                },
              },
            }}
          />
        </BookingProvider>
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);
