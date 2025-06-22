
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HeaderLogo = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="flex items-center gap-3 cursor-pointer"
      onClick={() => navigate('/')}
    >
      <img 
        src="/lovable-uploads/a38a7187-5f12-41aa-bcc6-ef6ffb768fbf.png" 
        alt="EnglEuphoria Logo" 
        className="w-8 h-8 sm:w-10 sm:h-10"
      />
      <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        EnglEuphoria
      </h1>
    </div>
  );
};
