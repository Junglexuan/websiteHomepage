import React, { useState, useEffect } from 'react';

interface IframeProps {
  url: string; // 动态传入的 URL
  height?: string | number; // 可选的高度
  width?: string | number; // 可选的宽度
}

const IframeComponent: React.FC<IframeProps> = ({ url, height = '100%', width = '100%' }) => {
  const [loading, setLoading] = useState(true); // 用来显示加载状态

  // 在 iframe 加载时显示加载提示
  const handleLoadStart = () => {
    setLoading(true);
  };

  // 在 iframe 加载完成时隐藏加载提示
  const handleLoadEnd = () => {
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true); // 当 URL 变化时重新加载
  }, [url]);

  const iframeStyle = {
    width: width,
    height: height,
    border: 'none',
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
            color: '#1890ff',
          }}
        >
          Loading...
        </div>
      )}
      <iframe
        style={iframeStyle}
        src={url}
        onLoad={handleLoadEnd}
        onError={handleLoadEnd}
        onLoadStart={handleLoadStart}
        title="Iframe Content"
      />
    </div>
  );
};

export default IframeComponent;