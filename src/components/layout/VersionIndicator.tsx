import React from 'react';

export const VersionIndicator: React.FC = () => {
  const APP_VERSION = '1.2.4'; // Added color picker for categories
  
  return (
    <div 
      className="fixed bottom-2 left-2 text-[10px] text-gray-300 font-mono z-50"
      title="Версия приложения"
    >
      v{APP_VERSION}
    </div>
  );
};
