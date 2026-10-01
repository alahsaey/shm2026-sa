import {StrictMode, Component, ErrorInfo, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div dir="rtl" style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          color: '#1e293b',
          fontFamily: 'sans-serif',
          padding: '24px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '16px'
            }}>⚠️</div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 900,
              color: '#0f172a',
              marginBottom: '12px',
              letterSpacing: '-0.025em'
            }}>حدث خطأ غير متوقع في التطبيق</h1>
            <p style={{
              color: '#64748b',
              fontSize: '15px',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              نعتذر عن هذا الخلل. قد يكون السبب تعارض في البيانات المحلية المخزنة سابقاً أو تعذر الاتصال ببعض الخوادم الخارجية.
            </p>
            <div style={{
              backgroundColor: '#f1f5f9',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'left',
              direction: 'ltr',
              overflow: 'auto',
              maxHeight: '150px',
              fontSize: '13px',
              fontFamily: 'monospace',
              color: '#334155',
              border: '1px solid #e2e8f0',
              marginBottom: '24px'
            }}>
              {this.state.error?.toString()}
            </div>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                إعادة تحميل الصفحة
              </button>
              <button 
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                مسح البيانات المحلية وإعادة تشغيل التطبيق
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

