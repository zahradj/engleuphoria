
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'large',
  onClick,
  className = ''
}) => {
  const navigate = useNavigate();
  
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-20',
    xlarge: 'h-32'
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };

  return (
    <div onClick={handleClick} className={`cursor-pointer ${className}`}>
      <img 
        src="/lovable-uploads/4570be6a-7587-485e-b773-d00f9b02a024.png" 
        alt="Engleuphoria Logo" 
        className={`${sizeClasses[size]} w-auto`} 
      />
    </div>
  );
};
