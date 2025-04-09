import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error Details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Component Stack Error Details:</p>
            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
          <button 
            onClick={() => window.location.href = '/'} 
            className="error-button"
          >
            Go to Home Page
          </button>
          
          <style jsx>{`
            .error-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              margin: 2rem auto;
              max-width: 800px;
              background-color: #ffebee;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            h2 {
              color: #c62828;
              margin-bottom: 1rem;
            }
            
            details {
              margin: 1rem 0;
              padding: 1rem;
              background-color: #fff;
              border-radius: 4px;
              width: 100%;
            }
            
            summary {
              cursor: pointer;
              color: #c62828;
              font-weight: bold;
            }
            
            pre {
              background-color: #f5f5f5;
              padding: 1rem;
              overflow-x: auto;
              border-radius: 4px;
            }
            
            .error-button {
              margin-top: 1rem;
              padding: 0.5rem 1rem;
              background-color: #2196f3;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
            }
            
            .error-button:hover {
              background-color: #1976d2;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
