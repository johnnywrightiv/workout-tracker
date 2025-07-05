import React from 'react';

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="border-primary border-t-accent flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-t-4 border-solid"></div>
    </div>
  );
};

export default Loading;
