export default function LoadingOverlay() {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999, // ensure it sits above all content
          cursor: 'not-allowed',
        }}
      />
    );
  }
  